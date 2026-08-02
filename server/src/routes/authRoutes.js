import express from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5,
  message: { message: 'Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' },
});

router.post('/login', loginLimiter, login);

export default router;
