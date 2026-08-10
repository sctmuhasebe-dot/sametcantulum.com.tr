// server/src/controllers/authController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🔒 Kritik Güvenlik Kontrolü: .env içinde JWT_SECRET tanımlı değilse uygulama hiç başlamasın!
if (!process.env.JWT_SECRET) {
  throw new Error('Kritik Hata: JWT_SECRET ortam değişkeni (.env içinde) tanımlı değil!');
}

const JWT_SECRET = process.env.JWT_SECRET;

// 1. GİRİŞ İŞLEMİ (LOGIN)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı veritabanında ara
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    const user = userResult.rows[0];

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // JWT Token oluştur (24 saat geçerli)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 🔒 TOKEN'I GÜVENLİ HTTPONLY COOKIE OLARAK TARAYICIYA BIRAKIYORUZ
    res.cookie('adminToken', token, {
      httpOnly: true,                                    // JavaScript'ten tamamen gizlenir (XSS koruması)
      secure: process.env.NODE_ENV === 'production', // Canlıda HTTPS protokolünü zorunlu kılar
      sameSite: 'strict',                                // CSRF saldırılarına karşı en üst düzey koruma
      maxAge: 24 * 60 * 60 * 1000                        // 24 Saat milisaniye cinsinden ömür
    });

    // Artık token'ı açıkça JSON içinde göndermiyoruz, sadece başarı mesajı ve kullanıcı bilgisi dönüyoruz
    res.json({
      success: true,
      message: 'Giriş başarılı.',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('🔥 GİRİŞ HATASI DETAYI:', error);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.', 
      error: isProduction ? undefined : error.message 
    });
  }
};

// 2. ÇIKIŞ İŞLEMİ (LOGOUT)
export const logout = (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ success: true, message: 'Başarıyla çıkış yapıldı.' });
};

// 3. OTURUM BİLGİSİ GETİRME (GET ME)
export const getMe = async (req, res) => {
  try {
    // authenticateToken middleware'i sayesinde req.user dolu geliyor
    const userId = req.user.id;

    const userResult = await pool.query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    const user = userResult.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('🔥 GET ME HATASI DETAYI:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
  }
};