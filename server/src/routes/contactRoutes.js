// server/src/routes/contactRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendMessage } from '../controllers/contactController.js';

const router = express.Router();

// 🔒 Güvenlik: Aynı IP adresinden 1 saat içinde en fazla 10 mesaj gönderilebilir
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 10,
  message: { message: 'Çok fazla mesaj gönderildi. Lütfen daha sonra tekrar deneyin.' },
});

// POST /api/contact
router.post('/', contactLimiter, sendMessage);

export default router;