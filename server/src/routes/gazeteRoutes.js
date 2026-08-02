import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import iconv from 'iconv-lite';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// --- RESMİ GAZETE ÖNBELLEK (CACHE) MEKANİZMASI ---
let cache = {
  dateKey: null,
  data: null,
  timestamp: 0
};
const CACHE_TTL = 60 * 60 * 1000; // 1 saatlik önbellek süresi

// --- SSL SERTİFİKASI VE DİNAMİK AGENT AYARLARI ---
let agent;
try {
  const certPath = path.join(process.cwd(), 'certs', 'kokshs-v7.crt');
  const isProd = process.env.NODE_ENV === 'production';

  if (fs.existsSync(certPath)) {
    const caCert = fs.readFileSync(certPath);
    agent = new https.Agent({
      rejectUnauthorized: isProd, // Production'da zorunlu güvenli, Local'de zincir hatasını es geçer
      ca: caCert
    });
    console.log(`[Resmi Gazete API] Sertifika yüklendi. (Mod: ${isProd ? 'Production/Strict' : 'Local/Flexible'})`);
  } else {
    agent = new https.Agent({ rejectUnauthorized: isProd });
  }
} catch (error) {
  console.warn('[Resmi Gazete API] Sertifika okuma uyarısı, varsayılan moda geçildi:', error.message);
  agent = new https.Agent({ rejectUnauthorized: false });
}

// --- TÜRKÇE KARAKTER VE METİN TEMİZLİĞİ ---
function fixTurkishCharacters(text) {
  if (!text) return '';
  return text
    .replace(/þ/g, 'ş').replace(/Þ/g, 'Ş')
    .replace(/ý/g, 'ı').replace(/Ý/g, 'İ')
    .replace(/ð/g, 'ğ').replace(/Ð/g, 'Ğ')
    .replace(/[\u0096\u0097\u0091\u0092\u0093\u0094]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- AKILLI BUFFER DECODE ---
function decodeBuffer(buffer) {
  const utf8Str = buffer.toString('utf-8');
  if (!utf8Str.includes('\uFFFD')) {
    return fixTurkishCharacters(utf8Str);
  }
  return fixTurkishCharacters(iconv.decode(buffer, 'iso-8859-9'));
}

router.get('/', async (req, res) => {
  console.log('[Resmi Gazete API] İstek alındı...');

  try {
    const { date } = req.query;
    let year, month, day;

    if (date && date.includes('-')) {
      const parts = date.split('-');
      year = parts[0];
      month = parts[1].padStart(2, '0');
      day = parts[2].padStart(2, '0');
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = String(now.getMonth() + 1).padStart(2, '0');
      day = String(now.getDate()).padStart(2, '0');
    }

    const cacheKey = `${year}-${month}-${day}`;

    // Önbellek kontrolü (Cache Hit)
    if (cache.dateKey === cacheKey && cache.data && (Date.now() - cache.timestamp < CACHE_TTL)) {
      console.log(`[Resmi Gazete API] Önbellekten servis ediliyor (Cache Hit): ${cacheKey}`);
      return res.json(cache.data);
    }

    const formattedDate = `${year}${month}${day}`;
    const targetUrl = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${formattedDate}.htm`;
    const mainUrl = `https://www.resmigazete.gov.tr`;

    let htmlData = '';

    try {
      console.log(`[Resmi Gazete API] Arşiv adresi çağrılıyor: ${targetUrl}`);
      const response = await axios.get(targetUrl, {
        timeout: 4000,
        httpsAgent: agent,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      htmlData = decodeBuffer(Buffer.from(response.data));
    } catch (archiveErr) {
      console.log(`[Resmi Gazete API] Arşiv bulunamadı veya zaman aşımı. Ana sayfaya geçiliyor...`);
      const mainResponse = await axios.get(mainUrl, {
        timeout: 4000,
        httpsAgent: agent,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      htmlData = decodeBuffer(Buffer.from(mainResponse.data));
    }

    const $ = cheerio.load(htmlData);
    const newsList = [];

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      let title = $(el).text().trim();
      title = fixTurkishCharacters(title);

      if (title && title.length > 3 && href && !href.startsWith('#') && !href.includes('javascript:')) {
        let fullLink = href;
        if (!href.startsWith('http')) {
          if (href.startsWith('/')) {
            fullLink = `https://www.resmigazete.gov.tr${href}`;
          } else {
            fullLink = `https://www.resmigazete.gov.tr/eskiler/${year}/${month}/${href}`;
          }
        }

        let category = 'Yürütme ve İdare Bölümü';
        const lowerTitle = title.toLocaleLowerCase('tr-TR');

        if (lowerTitle.includes('tebliğ')) category = 'Tebliğ';
        else if (lowerTitle.includes('yönetmelik')) category = 'Yönetmelik';
        else if (lowerTitle.includes('karar')) category = 'Karar / Duyuru';
        else if (lowerTitle.includes('kanun')) category = 'Kanun';
        else if (lowerTitle.includes('ilan')) category = 'İlan';

        const ignoreWords = ['ana sayfa', 'iletişim', 'arşiv', 'fihrist', 'mükerrer', 'pdf', 'yazdır', 'html'];
        const isIgnored = ignoreWords.some(word => lowerTitle === word);

        if (!isIgnored) {
          newsList.push({
            title,
            link: fullLink,
            category
          });
        }
      }
    });

    const uniqueNews = newsList.filter((item, index, self) =>
      index === self.findIndex((t) => t.title === item.title)
    ).slice(0, 30);

    console.log(`[Resmi Gazete API] Başarıyla ${uniqueNews.length} adet başlık çekildi.`);

    const responsePayload = {
      success: true,
      date: `${day}.${month}.${year}`,
      data: uniqueNews
    };

    // Önbelleğe kaydet
    cache = {
      dateKey,
      data: responsePayload,
      timestamp: Date.now()
    };

    return res.json(responsePayload);

  } catch (err) {
    console.error('[Resmi Gazete API] Kritik Hata:', err.message);
    return res.status(200).json({
      success: false,
      message: 'Resmi Gazete verilerine şu an ulaşılamıyor.',
      data: []
    });
  }
});

export default router;