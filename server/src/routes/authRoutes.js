import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5,
  message: { message: 'Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' },
});

router.post('/login', loginLimiter, login);

// 🟢 YENİ: Dashboard ve korumalı sayfaların oturum kontrolü yapabileceği endpoint'ler
router.get('/me', authenticateToken, getMe);
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;