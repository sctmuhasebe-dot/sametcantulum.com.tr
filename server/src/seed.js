import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@sametcantulum.com.tr';
  const rawPassword = process.env.ADMIN_PASSWORD;
  const role = 'admin';

  if (!rawPassword || rawPassword.length < 12) {
    console.error('❌ ADMIN_PASSWORD .env dosyasında tanımlı olmalı ve en az 12 karakter olmalı.');
    console.error('   Örnek: ADMIN_PASSWORD=CokGucluBirSifre-2026!');
    process.exit(1);
  }

  try {
    // Şifreyi bcrypt ile hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // Veritabanına ekle veya şifreyi güncelle
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = $2;
    `;

    await pool.query(query, [email, hashedPassword, role]);
    console.log('✅ Admin kullanıcısı başarıyla oluşturuldu/güncellendi!');
    console.log(`📧 E-Posta: ${email}`);
    console.log(`🔑 Şifre: ${rawPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    process.exit(1);
  }
}

seedAdmin();