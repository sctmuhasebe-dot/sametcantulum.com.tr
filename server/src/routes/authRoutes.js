import express from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js'; // Varsa mevcut middleware yolunuz

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5,
  message: { message: 'Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' },
});

router.post('/login', loginLimiter, login);

// 🟢 YENİ: Dashboard ve korumalı sayfaların oturum kontrolü yapabileceği endpoint
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;