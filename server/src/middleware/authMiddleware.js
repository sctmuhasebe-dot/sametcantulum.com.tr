// server/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Token'ı artık Authorization header yerine güvenli httpOnly çerezden alıyoruz
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi. Oturum açmanız gerekiyor.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Sunucu yapılandırma hatası: JWT_SECRET tanımlanmamış.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş oturum.' });
    }
    req.user = user;
    next();
  });
};