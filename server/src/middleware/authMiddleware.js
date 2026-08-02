// server/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Token'ı artık Authorization header yerine güvenli httpOnly çerezden alıyoruz
  const token = req.cookies?.adminToken;

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi. Oturum açmanız gerekiyor.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'gizli_jwt_anahtari', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş oturum.' });
    }
    req.user = user;
    next();
  });
};