import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const router = Router();

// Kayıt
router.post('/register', AuthController.register);

// Giriş
// router.post('/login', loginLimiter, AuthController.login); // rate-limit kullanırsan
router.post('/login', AuthController.login);

// Çıkış
router.post('/logout', authenticateToken, AuthController.logout);

// Profil bilgileri
router.get('/me', authenticateToken, AuthController.getProfile);

// Şifre değiştirme
router.post('/change-password', authenticateToken, AuthController.changePassword);

// (Opsiyonel) Token yenileme
// router.post('/refresh', authenticateToken, AuthController.refreshToken);

export default router;
