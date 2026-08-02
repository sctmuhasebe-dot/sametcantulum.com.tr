// server/src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Çerez yönetimi için
import helmet from 'helmet'; // 🔒 Güvenlik başlıkları (XSS, Clickjacking koruması)
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import gazeteRoutes from './routes/gazeteRoutes.js';
import toolsRoutes from './routes/tools.js';
import contactRoutes from './routes/contactRoutes.js'; // İletişim rotası

const app = express();

// 🔒 Helmet güvenlik HTTP başlıklarını aktif ediyoruz
app.use(helmet());

// İzin verilecek kök adreslerin listesi (CORS güvenliği)
const allowedOrigins = [
  'http://localhost:4321',         // Astro local geliştirme ortamı
  'http://localhost:3000',         // Alternatif local port
  'https://sametcantulum.com.tr',  // Canlı site adresi
  'https://www.sametcantulum.com.tr', // Canlı site www sürümü
  process.env.ALLOWED_ORIGIN       // .env dosyasında tanımlı özel adres
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Postman, curl, mobil uygulamalar veya sunucu içi isteklerde origin boş (undefined) gelebilir
    if (!origin) {
      return callback(null, true);
    }
    
    // Sabit izin verilen listesinde mi?
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Vercel preview domain kontrolü: Production'da sadece kendi proje pattern'imize izin verilir
    const isProduction = process.env.NODE_ENV === 'production';
    const isOwnVercelPreview = /^https:\/\/sametcantulum-[a-z0-9-]+\.vercel\.app$/.test(origin);

    if (isOwnVercelPreview && (!isProduction || isOwnVercelPreview)) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS politikası bu origin için izin vermiyor.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // ⚠️ HttpOnly çerezlerin (adminToken) güvenle taşınması için zorunludur
}));

// 🔒 İstek gövdesi (payload) boyut sınırı (DoS saldırılarına karşı 1MB limit)
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser()); // Tarayıcıdan gelen çerezleri okumak için

// API Rotaları (Endpoints)
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/resmi-gazete', gazeteRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/contact', contactRoutes);

// Sağlık / Durum Kontrolü Endpoint'i
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API sorunsuz çalışıyor.' });
});

export default app;