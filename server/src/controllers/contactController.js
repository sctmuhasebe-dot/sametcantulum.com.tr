// server/src/controllers/contactController.js
import pool from '../config/db.js';
import nodemailer from 'nodemailer';

// Kullanıcı girdisini e-posta HTML şablonuna basmadan önce güvenli hale getirir
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// E-posta gönderim yapılandırması (Nodemailer)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // TLS için false (587 portu)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Yeni mesaj gönder ve kaydet
export const sendMessage = async (req, res) => {
  // 🚀 akis ve taahhutname değerleri req.body'den çekiliyor
  const { name, email, phone, subject, message, kvkk, akis, taahhutname } = req.body;

  // 1. Temel Doğrulama (Zorunlu Alanlar)
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: 'Lütfen tüm zorunlu alanları eksiksiz doldurun.' });
  }

  // 2. Kesin Sahte E-Posta / Spam Filtresi
  const cleanEmail = email.trim().toLowerCase();
  const blockedDomains = ['test.com', 'example.com', 'asdf.com', 'abc.com', 'qwe.com', 'mail.com', 'sample.com'];
  const emailUser = cleanEmail.split('@')[0];
  const emailDomain = cleanEmail.split('@')[1];

  const isInvalidEmailPattern = 
    !cleanEmail.includes('@') || 
    !cleanEmail.includes('.') || 
    cleanEmail.length < 6 ||
    blockedDomains.includes(emailDomain) ||
    // a@a.com, x@x.com, test@test.com gibi aynı karakter tekrarlarını yakalar
    /^([a-z0-9])\1+@\1+\.[a-z]{2,}$/.test(cleanEmail) ||
    // Kullanıcı adı çok kısa veya anlamsız olanları yakalar (örn: a@, 1@, as@)
    emailUser.length <= 2;

  if (isInvalidEmailPattern) {
    return res.status(400).json({ message: 'Lütfen geçerli, gerçek ve aktif bir e-posta adresi giriniz.' });
  }

  // 3. Kesin Telefon Numarası Filtresi (Sallama numaraları engeller)
  const cleanPhone = phone.replace(/\D/g, '');
  const isAllSameDigits = /^(\d)\1{9,}$/.test(cleanPhone); // Örn: 05555555555, 1111111111 gibi

  if (cleanPhone.length < 10 || isAllSameDigits) {
    return res.status(400).json({ message: 'Lütfen geçerli ve kullanılan bir cep telefonu numarası giriniz.' });
  }

  // 4. 🚀 Tüm Yasal Metinlerin Onay Kontrolü (KVKK, Açık Rıza, Taahhütname)
  if (!kvkk || kvkk === false || kvkk === 'false' || kvkk === 'off') {
    return res.status(400).json({ message: 'KVKK Aydınlatma Metni onaylanmadan mesaj gönderilemez.' });
  }
  if (!akis || akis === false || akis === 'false' || akis === 'off') {
    return res.status(400).json({ message: 'Açık Rıza Metni onaylanmadan mesaj gönderilemez.' });
  }
  if (!taahhutname || taahhutname === false || taahhutname === 'false' || taahhutname === 'off') {
    return res.status(400).json({ message: 'Kişisel Verilerin Aktarımına İlişkin Taahhütname onaylanmadan mesaj gönderilemez.' });
  }

  try {
    // 5. 🚀 Veritabanına Kaydet (Doğru parametre eşleşmesi ve zaman damgaları)
    const query = `
      INSERT INTO messages (
        name, email, phone, subject, message, 
        kvkk_onay, kvkk_onay_at, 
        akis_onay, akis_onay_at, 
        taahhutname_onay, taahhutname_onay_at, 
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), $8, NOW(), NOW())
      RETURNING *;
    `;
    
    // Değerler dizisi SQL sorgusundaki $1, $2, $3, $4, $5, $6, $7, $8 sıralamasıyla birebir eşleştirildi:
    const values = [
      name.trim(),       // $1
      cleanEmail,        // $2
      phone.trim(),      // $3
      subject.trim(),    // $4
      message.trim(),    // $5
      true,              // $6 -> kvkk_onay
      true,              // $7 -> akis_onay
      true               // $8 -> taahhutname_onay
    ];

    const dbResult = await pool.query(query, values);
    const savedMessage = dbResult.rows[0];

    // 6. E-posta Bildirimi Gönder
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const currentTime = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
      
      const mailOptions = {
        from: `"Samet Can Tulum Web" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
        subject: `Yeni İletişim Formu: ${escapeHtml(subject)}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #059669; margin-bottom: 20px;">Web Sitenizden Yeni Mesaj Var</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Ad Soyad:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>E-posta:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Telefon:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Konu:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${escapeHtml(subject)}</td></tr>
            </table>

            <h3 style="color: #334155; font-size: 16px; margin-top: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Yasal Onaylar</h3>
            <ul style="list-style-type: none; padding-left: 0; font-size: 14px; color: #475569;">
              <li style="margin-bottom: 5px;">✅ <strong>KVKK Aydınlatma Metni:</strong> Onaylandı <span style="font-size: 12px; color: #94a3b8;">(${currentTime})</span></li>
              <li style="margin-bottom: 5px;">✅ <strong>Açık Rıza Metni:</strong> Onaylandı <span style="font-size: 12px; color: #94a3b8;">(${currentTime})</span></li>
              <li style="margin-bottom: 5px;">✅ <strong>Taahhütname:</strong> Onaylandı <span style="font-size: 12px; color: #94a3b8;">(${currentTime})</span></li>
            </ul>

            <h3 style="color: #334155; font-size: 16px; margin-top: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Mesaj İçeriği</h3>
            <p style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-line; border: 1px solid #e2e8f0; color: #1e293b; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error('E-posta gönderilemedi (Ancak mesaj veritabanına kaydedildi):', mailError);
      }
    }

    return res.status(201).json({ 
      success: true, 
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.', 
      data: savedMessage 
    });

  } catch (error) {
    console.error('İletişim formu kaydedilirken hata:', error);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    return res.status(500).json({ 
      message: 'Sunucu hatası, mesaj gönderilemedi.',
      error: isProduction ? undefined : error.message
    });
  }
};