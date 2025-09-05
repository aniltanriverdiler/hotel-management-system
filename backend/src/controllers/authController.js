import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthController {
  /**
   * Kullanıcı kaydı
   */
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Ad, email ve şifre zorunludur",
        });
      }

      // Email formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Geçerli bir email adresi giriniz",
        });
      }

      // Şifre uzunluğu kontrolü
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Şifre en az 6 karakter olmalıdır",
        });
      }

      // Email benzersiz mi kontrol et
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "Bu email adresi zaten kullanılıyor",
        });
      }

      // Şifre hashle
      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_SALT_ROUNDS) || 12
      );

      const allowedRoles = ["CUSTOMER", "HOTEL_OWNER", "SUPPORT"];
      const userRole = allowedRoles.includes(role) ? role : "CUSTOMER";

      // Kullanıcı oluştur
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: userRole,
          is_online: false, 
        },
      });

      // JWT token oluştur
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        success: true,
        message: "Kullanıcı başarıyla oluşturuldu",
        data: { user: userWithoutPassword, token },
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        success: false,
        error: "Kayıt işlemi başarısız",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Bir hata oluştu",
      });
    }
  }

  /**
   * Kullanıcı girişi
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email ve şifre zorunludur",
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Geçersiz email veya şifre",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: "Geçersiz email veya şifre",
        });
      }
      // is_online=true
      const updatedUser = await prisma.user.update({
      where: { user_id: user.user_id },
      data: { is_online: true },
    });

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const { password: _, ...userWithoutPassword } = updatedUser;

      return res.json({
        success: true,
        message: "Giriş başarılı",
        data: { user: userWithoutPassword, token },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        error: "Giriş işlemi başarısız",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Bir hata oluştu",
      });
    }
  }

  /**
   * Profil bilgilerini getir
   */
  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "Kullanıcı bulunamadı" });
      }

      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        data: { user: userWithoutPassword },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        error: "Profil bilgileri alınamadı",
      });
    }
  }

  /**
   * Şifre değiştir
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Mevcut şifre ve yeni şifre zorunludur",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Yeni şifre en az 6 karakter olmalıdır",
        });
      }

      const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "Kullanıcı bulunamadı" });
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res
          .status(400)
          .json({ success: false, error: "Mevcut şifre yanlış" });
      }

      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_SALT_ROUNDS) || 12
      );

      await prisma.user.update({
        where: { user_id: req.user.user_id },
        data: { password: hashedNewPassword },
      });

      return res.json({
        success: true,
        message: "Şifre başarıyla değiştirildi",
      });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({
        success: false,
        error: "Şifre değiştirilemedi",
      });
    }
  }

  /**
   * Çıkış yap
   */
  async logout(req, res) {
   try {
    const { user_id } = req.user;

    //is_online = false 
    await prisma.user.update({
      where: { user_id },
      data: { is_online: false },
    });
    } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      error: "Çıkış işlemi başarısız",
    });
  }
    return res.json({
      success: true,
      message: "Başarıyla çıkış yapıldı",
    });
  }

  /**
   * Token yenileme
   */
  async refreshToken(req, res) {
    try {
      const { user_id } = req.user;

      const user = await prisma.user.findUnique({
        where: { user_id },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "Kullanıcı bulunamadı" });
      }

      const newToken = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        message: "Token yenilendi",
        data: { token: newToken },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res.status(500).json({
        success: false,
        error: "Token yenilenemedi",
      });
    }
  }
}

export default new AuthController();