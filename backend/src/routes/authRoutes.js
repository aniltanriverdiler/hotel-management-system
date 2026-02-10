import { Router } from "express";
import AuthController from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Registration
router.post("/register", AuthController.register);

// Login
// router.post('/login', loginLimiter, AuthController.login); // if you use rate-limit
router.post("/login", AuthController.login);

// Logout
router.post("/logout", authenticateToken, AuthController.logout);

// Profile information
router.get("/me", authenticateToken, AuthController.getProfile);

// Change password
router.post(
  "/change-password",
  authenticateToken,
  AuthController.changePassword
);

// (Optional) Token refresh
// router.post('/refresh', authenticateToken, AuthController.refreshToken);

export default router;
