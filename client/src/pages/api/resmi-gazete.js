import { load } from 'cheerio';

export const prerender = false;

export async function GET({ request }) {
  try {
    const urlObj = new URL(request.url);
    const dateStr = urlObj.searchParams.get('date');

    if (!dateStr) {
      return new Response(JSON.stringify({ success: false, message: 'Tarih parametresi gerekli.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formattedDate = dateStr.replace(/-/g, '');
    const year = formattedDate.substring(0, 4);
    const month = formattedDate.substring(4, 6);
    const day = formattedDate.substring(6, 8);

    const targetUrl = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${formattedDate}.htm`;

    // Vercel engelini aşmak için güvenli bir CORS proxy yönlendirmesi kullanıyoruz
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `${dateStr} tarihine ait Resmi Gazete yayını bulunamadı (Tatil veya pazar günü olabilir).` 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const htmlText = await response.text();
    const $ = load(htmlText);
    const items = [];

    $('a').each((_, element) => {
      let title = $(element).text().trim();
      let link = $(element).attr('href');

      title = title.replace(/\s+/g, ' ');

      if (title && link && title.length > 15) {
        if (!link.startsWith('http')) {
          link = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${link}`;
        }

        let category = "Mevzuat & Kararlar";
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('yönetmelik')) category = "Yönetmelikler";
        else if (lowerTitle.includes('tebliğ')) category = "Tebliğler";
        else if (lowerTitle.includes('ilân') || lowerTitle.includes('ilan')) category = "İlanlar";
        else if (lowerTitle.includes('karar')) category = "Kararlar";

        if (!items.some(item => item.title === title)) {
          items.push({ category, title, link });
        }
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: items.length > 0 ? items : [{ category: "Resmi Gazete", title: `${dateStr} Tarihli Resmi Gazete Sayısı`, link: targetUrl }]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('PROXIED API KRİTİK HATA:', error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Resmi Gazete verilerine erişilemedi. Lütfen geçerli bir tarih seçin.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}