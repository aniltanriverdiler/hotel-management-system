import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class UserModel {
  // Create new user
  async createUser(userData) {
    try {
      const { email, password, name, role = "CUSTOMER" } = userData;

      // Email validation
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error("Bu email zaten kullanılıyor");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  async findUserByEmail(email) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  // Find user by id
  async findUserById(user_id) {
    try {
      return await prisma.user.findUnique({ where: { user_id } });
    } catch (error) {
      throw error;
    }
  }

  // Update user information
  async updateUser(user_id, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      return await prisma.user.update({
        where: { user_id },
        data: updateData,
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(user_id) {
    try {
      return await prisma.user.delete({ where: { user_id } });
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      return await prisma.user.findMany({
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role) {
    try {
      return await prisma.user.findMany({
        where: { role },
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // Get user count
  async getUserCount() {
    try {
      return await prisma.user.count();
    } catch (error) {
      throw error;
    }
  }

  // Search users by name or email
  async searchUsers(searchTerm) {
    try {
      return await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new UserModel();
