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

    // Resmi Gazete'nin güncel ve alternatif URL formatları
    const targetUrls = [
      `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${formattedDate}.htm`,
      `https://www.resmigazete.gov.tr/${year}/${month}/${formattedDate}.htm`
    ];

    let htmlText = null;
    let successfulUrl = '';

    for (const targetUrl of targetUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye zaman aşımı

        const response = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'tr-TR,tr;q=0.9'
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          htmlText = await response.text();
          successfulUrl = targetUrl;
          break;
        }
      } catch (e) {
        // Döngü sonraki URL'yi deneyecek
      }
    }

    if (!htmlText) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `${dateStr} tarihine ait Resmi Gazete yayını bulunamadı (Tatil veya pazar günü olabilir).` 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
      data: items.length > 0 ? items : [{ category: "Resmi Gazete", title: `${dateStr} Tarihli Resmi Gazete Sayısı`, link: successfulUrl }]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API KRİTİK HATA:', error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Sunucu işleme hatası oluştu.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}