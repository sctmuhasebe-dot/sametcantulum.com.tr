// client/src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, kvkk_onay, akis_onay, taahhutname_onay } = body;

    if (!name || !email || !phone || !subject || !message) {
      return new Response(JSON.stringify({ success: false, error: 'Tüm zorunlu alanları doldurunuz.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date().toISOString();

    // 1. Supabase'e Kayıt Ekleme
    const { error: dbError } = await supabase
      .from('messages')
      .insert([
        { 
          name, 
          email, 
          phone, 
          subject, 
          message, 
          kvkk_onay: kvkk_onay ?? true,
          kvkk_onay_at: now,
          akis_onay: akis_onay ?? true,
          akis_onay_at: now,
          taahhutname_onay: taahhutname_onay ?? true,
          taahhutname_onay_at: now,
          created_at: now 
        }
      ]);

    if (dbError) {
      console.error('Supabase Kayıt Hatası:', dbError);
      throw new Error('Veritabanına kayıt eklenemedi.');
    }

    // 2. Nodemailer ile Gmail Gönderimi
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(import.meta.env.SMTP_PORT) || 587,
      secure: false, // 587 portu için false
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Samet Can Tulum Web" <${import.meta.env.SMTP_USER}>`,
      to: import.meta.env.SMTP_USER, // Kendi mail adresinize gelir
      subject: `Yeni İletişim Mesajı: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #059669; margin-top: 0;">Web Sitenizden Yeni Mesaj Var</h2>
          <p><strong>Ad Soyad:</strong> ${name}</p>
          <p><strong>E-Posta:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Konu:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p><strong>Mesaj:</strong></p>
          <p style="background: #f8fafc; padding: 12px; border-radius: 8px; line-height: 1.5;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p style="font-size: 11px; color: #64748b;">Bu mesaj sametcantulum.com.tr iletişim formu üzerinden gönderilmiştir. Tüm yasal onaylar (KVKK, Açık Rıza, Taahhütname) alınmıştır.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: 'Mesaj başarıyla iletildi.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('API İşlem Hatası:', err);
    return new Response(JSON.stringify({ success: false, error: err.message || 'Bir hata oluştu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};