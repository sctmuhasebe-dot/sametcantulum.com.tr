import { load } from 'cheerio';

export const prerender = false;

export async function GET({ request }) {
  const urlObj = new URL(request.url);
  const dateStr = urlObj.searchParams.get('date'); // Örn: 2026-08-02

  if (!dateStr) {
    return new Response(JSON.stringify({ success: false, message: 'Tarih parametresi gerekli.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
    });
  }

  try {
    const formattedDate = dateStr.replace(/-/g, '');
    const year = formattedDate.substring(0, 4);
    const month = formattedDate.substring(4, 6);
    const day = formattedDate.substring(6, 8);

    const targetUrl = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${formattedDate}.htm`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `${dateStr} tarihine ait Resmi Gazete yayını bulunamadı.` 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
      });
    }

    // Türkçe karakterlerin bozulmaması için buffer'ı windows-1254 formatında decode ediyoruz
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1254');
    const htmlText = decoder.decode(buffer);

    const $ = load(htmlText);
    const items = [];

    // Resmi Gazete HTML yapısındaki başlıkları ve bağlantıları tarıyoruz
    $('a').each((_, element) => {
      let title = $(element).text().trim();
      let link = $(element).attr('href');

      // Fazla boşlukları temizle
      title = title.replace(/\s+/g, ' ');

      // Sadece anlamlı ve ilgili metin içeren bağlantıları alalım
      if (title && link && title.length > 15) {
        // Göreceli (relative) linkleri tam URL'ye çevir
        if (!link.startsWith('http')) {
          link = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${link}`;
        }

        // Kategori tespiti
        let category = "Mevzuat & Kararlar";
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('yönetmelik')) category = "Yönetmelikler";
        else if (lowerTitle.includes('tebliğ')) category = "Tebliğler";
        else if (lowerTitle.includes('ilân') || lowerTitle.includes('ilan')) category = "İlanlar";
        else if (lowerTitle.includes('karar')) category = "Kararlar";

        // Aynı başlıktan mükerrer kayıt olmasını önle
        if (!items.some(item => item.title === title)) {
          items.push({
            category,
            title,
            link
          });
        }
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: items.length > 0 ? items : [{ category: "Resmi Gazete", title: `${dateStr} Tarihli Resmi Gazete Sayısı`, link: targetUrl }]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
    });

  } catch (error) {
    console.error('API Parse Hatası:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Veriler işlenirken sunucu tarafında bir hata oluştu.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
    });
  }
}