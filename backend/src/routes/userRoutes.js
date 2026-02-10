import express from "express";
import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import {
  authenticateToken,
  authenticateTokenOptional,
  authorizeRoles,
  authorizeOwnResource,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Returns all users (only SUPPORT users)
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["SUPPORT"]),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Returns the profile of a user (their own profile or SUPPORT users can see all profiles)
router.get("/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdInt = parseInt(userId, 10);

    // Checks if the user is the owner of the profile or a SUPPORT user
    if (req.user.role !== "SUPPORT" && req.user.user_id !== userIdInt) {
      return res.status(403).json({
        success: false,
        message: "Bu profili görüntüleme yetkiniz bulunmamaktadır.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası.",
    });
  }
});
/**
 * Updates the profile of a user
 * - CUSTOMER → only the user can update their own profile
 * - SUPPORT → all users can update their profiles
 */
router.put(
  "/profile/:userId",
  authenticateToken,
  async (req, res, next) => {
    if (req.user.role === "SUPPORT") {
      // SUPPORT users can update all profiles
      return next();
    }
    // Other users can only update their own profile
    return authorizeOwnResource(parseInt(req.params.userId, 10))(
      req,
      res,
      next
    );
  },
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email } = req.body;

      const updatedUser = await prisma.user.update({
        where: { user_id: parseInt(userId, 10) },
        data: { name, email },
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      res.json({ success: true, data: updatedUser });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Bu email zaten kullanımda.",
        });
      }
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

/**
 * Creates a new user
 * - CUSTOMER → all users can register freely
 * - SUPPORT/HOTEL_OWNER → only SUPPORT users can register
 * - Password is hashed with bcrypt
 */
router.post("/register", authenticateTokenOptional, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Checks if the email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email adresi zaten kayıtlı.",
      });
    }

    // Hashes the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role is CUSTOMER
    let finalRole = "CUSTOMER";

    if (role && ["SUPPORT", "HOTEL_OWNER"].includes(role)) {
      // SUPPORT users can assign special roles
      if (!req.user || req.user.role !== "SUPPORT") {
        return res.status(403).json({
          success: false,
          message: "Bu rolü atamaya yetkiniz yok.",
        });
      }
      finalRole = role;
    }

    // Creates a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
export default router;
