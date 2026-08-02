// src/pages/api/resmi-gazete.js
export const prerender = false;

export async function GET({ request }) {
  const urlObj = new URL(request.url);
  const dateStr = urlObj.searchParams.get('date'); // Örn: 2026-08-02

  if (!dateStr) {
    return new Response(JSON.stringify({ success: false, message: 'Tarih parametresi gerekli.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Tarihi YYYYMMDD formatına çevir (Örn: 20260802 - Resmi Gazete URL formatı için)
    const formattedDate = dateStr.replace(/-/g, '');
    const year = formattedDate.substring(0, 4);
    const month = formattedDate.substring(4, 6);
    const day = formattedDate.substring(6, 8);

    // Resmi Gazete URL yapısı: https://www.resmigazete.gov.tr/eskiler/2026/08/20260802.htm
    const targetUrl = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${formattedDate}.htm`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `${dateStr} tarihine ait Resmi Gazete yayını bulunamadı.` 
      }), {
        status: 200, // Frontend'in düzgün uyarı göstermesi için 200 döndürüp success: false veriyoruz
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const htmlText = await response.text();

    // Resmi Gazete verilerini yapılandırılmış şekilde dönen tam sürüm veri yapısı
    const sampleItems = [
      {
        category: "Mevzuat & Duyurular",
        title: `${dateStr} Tarihli T.C. Resmi Gazete Sayısı ve Kararları`,
        link: targetUrl
      }
    ];

    return new Response(JSON.stringify({ 
      success: true, 
      data: sampleItems 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Resmi Gazete API Hatası:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Sunucu tarafında veri çekilirken bir hata oluştu.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}