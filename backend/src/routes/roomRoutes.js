// routes/roomRoutes.js
import express from "express";
import prisma from "../config/db.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Oda ekle (sadece otel sahibi kendi oteline veya SUPPORT)
 */
router.post("/", authenticateToken, authorizeRoles(["HOTEL_OWNER", "SUPPORT"]), async (req, res) => {
  try {
    const { hotel_id, room_type, price, capacity, description, quantity = 1 } = req.body;
    const { user_id, role } = req.user;

    // Otel gerçekten var mı kontrol et
    const hotel = await prisma.hotel.findUnique({ where: { hotel_id: Number(hotel_id) } });
    if (!hotel) {
      return res.status(404).json({ success: false, error: "Otel bulunamadı" });
    }

    // Eğer SUPPORT değilse, sadece kendi oteline oda ekleyebilir
    if (role !== "SUPPORT" && hotel.owner_id !== user_id) {
      return res.status(403).json({ success: false, error: "Bu otele oda ekleme yetkiniz yok" });
    }

    const room = await prisma.room.create({
      data: {
        hotel_id: Number(hotel_id),
        room_type,
        price: Number(price),
        capacity: Number(capacity),
        description,
        quantity: Number(quantity),
      },
    });

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Belirli otelin odalarını listele
 */
router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const { hotelId } = req.params;

    const rooms = await prisma.room.findMany({
      where: { hotel_id: Number(hotelId) },
      include: {
        reservations: {
          select: { start_date: true, end_date: true, status: true },
        },
      },
    });

    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Oda güncelle (sadece otel sahibi veya SUPPORT)
 */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { room_type, price, capacity, description, quantity } = req.body;
    const { user_id, role } = req.user;

    const room = await prisma.room.findUnique({
      where: { room_id: Number(id) },
      include: { hotel: true },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: "Oda bulunamadı" });
    }

    if (role !== "SUPPORT" && room.hotel.owner_id !== user_id) {
      return res.status(403).json({ success: false, error: "Bu odayı güncelleme yetkiniz yok" });
    }

    const updatedRoom = await prisma.room.update({
      where: { room_id: Number(id) },
      data: {
        room_type: room_type ?? room.room_type,
        price: price ? Number(price) : room.price,
        capacity: capacity ? Number(capacity) : room.capacity,
        description: description ?? room.description,
        quantity: quantity ? Number(quantity) : room.quantity,
      },
    });

    res.json({ success: true, data: updatedRoom });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Oda sil (sadece otel sahibi veya SUPPORT, aktif rezervasyonu yoksa)
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.user;

    const room = await prisma.room.findUnique({
      where: { room_id: Number(id) },
      include: { hotel: true },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: "Oda bulunamadı" });
    }

    if (role !== "SUPPORT" && room.hotel.owner_id !== user_id) {
      return res.status(403).json({ success: false, error: "Bu odayı silme yetkiniz yok" });
    }

    // Aktif rezervasyon kontrolü
    const activeReservations = await prisma.reservation.count({
      where: {
        room_id: Number(id),
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (activeReservations > 0) {
      return res.status(400).json({ success: false, error: "Aktif rezervasyonu olan oda silinemez" });
    }

    await prisma.room.delete({ where: { room_id: Number(id) } });

    res.json({ success: true, message: "Oda başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
