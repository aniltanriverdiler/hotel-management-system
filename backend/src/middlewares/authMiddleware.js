import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware to validate JWT from Authorization header
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN" format

    // If token is not found, return error
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Erişim token'ı bulunamadı. Lütfen giriş yapın.",
      });
    }

    // Validate JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user ID from token
    const userId = decoded.user_id;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      },
    });

    // If user is not found, return error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz token. Kullanıcı bulunamadı.",
      });
    }

    // Add user information to request object
    req.user = user;
    // Pass to next middleware
    next();
  } catch (error) {
    // JWT validation error
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Geçersiz token. Lütfen tekrar giriş yapın.",
      });
    }

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token süresi dolmuş. Lütfen tekrar giriş yapın.",
      });
    }

    // Other errors
    console.error("Auth middleware hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
    });
  }
};

// Optional JWT authentication middleware: proceeds silently if no Authorization header, verifies if present.
const authenticateTokenOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next();

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      },
    });

    if (user) {
      req.user = user;
    }
    return next();
  } catch (_) {
    // Optional, so we don't throw an error and continue
    return next();
  }
};

// Authorization middleware for specific roles
// @param {string[]} allowedRoles - Prisma enum values: CUSTOMER, HOTEL_OWNER, SUPPORT
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    // First run authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme gerekli. Lütfen giriş yapın.",
      });
    }

    // Check user role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için yetkiniz bulunmamaktadır.",
      });
    }

    next();
  };
};

// Ownership control
// @param {string} resourceUserId - The user_id of the resource being accessed
const authorizeOwnResource = (resourceUserId, allowSupport = true) => {
  return (req, res, next) => {
    // Optional: SUPPORT role can access all resources
    if (allowSupport && req.user.role === "SUPPORT") {
      return next();
    }

    // Normal users can only access their own data
    if (Number(req.user.user_id) !== Number(resourceUserId)) {
      return res.status(403).json({
        success: false,
        message: "Bu kaynağa erişim yetkiniz bulunmamaktadır.",
      });
    }

    next();
  };
};

export {
  authenticateToken,
  authenticateTokenOptional,
  authorizeRoles,
  authorizeOwnResource,
};
