// server/src/config/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Ortama göre SSL yapılandırması: 
// Canlı (production) ortamda sertifika doğrulaması tam aktif, diğer ortamlarda esnek.
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Üretim ortamında MITM koruması için true, aksi halde false/özelleştirilmiş
    rejectUnauthorized: isProduction ? true : false
  }
});

export default pool;