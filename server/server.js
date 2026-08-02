// backend/server.js
import dotenv from 'dotenv';

// 1. Çevre değişkenlerini app yüklenmeden ÖNCE başlatıyoruz
dotenv.config();

// app.js import'u dotenv'den sonra yapılmalı
import app from './src/app.js';
import pool from './src/config/db.js'; // Veritabanı havuzu import edildi

const PORT = Number(process.env.PORT) || 5000;

// 2. Sunucuyu başlatma
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sunucu ${PORT} portunda aktif olarak çalışıyor...`);
});

// 3. Beklenmeyen söz hatası veya çökme durumlarını yakalama (Graceful Shutdown)
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Yakalanmamış Promise Reddi:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Yakalanmamış İstisna:', error);
  // Kritik hatalarda sunucuyu ve veritabanı bağlantılarını güvenli şekilde kapat
  server.close(async () => {
    try {
      await pool.end();
      console.log('Database pool closed.');
    } catch (err) {
      console.error('Error closing database pool:', err);
    }
    process.exit(1);
  });
});

// Sunucu durdurulduğunda (Ctrl+C / SIGINT / SIGTERM) portu ve veritabanını serbest bırak
const gracefulShutdown = (signal) => {
  console.log(`⚡ ${signal} sinyali alındı, sunucu güvenli şekilde kapatılıyor...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('Veritabanı bağlantıları kapatıldı.');
    } catch (err) {
      console.error('Veritabanı kapatılırken hata:', err);
    }
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));