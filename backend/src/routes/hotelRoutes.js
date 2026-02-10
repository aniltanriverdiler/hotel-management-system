import express from "express";
import prisma from "../config/db.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Returns a list of cities where hotels are located.
router.get("/cities/list", async (_req, res) => {
  try {
    const cities = await prisma.hotel.findMany({
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    });

    res.json({
      success: true,
      data: cities.map((c) => c.city),
    });
  } catch (err) {
    console.error("Get cities error:", err);
    res
      .status(500)
      .json({
        success: false,
        error: "Şehir listesi getirilirken hata oluştu",
      });
  }
});

// Returns a list of all hotels with optional filtering, pagination, average rating and review count.
router.get("/", async (req, res) => {
  try {
    const { city, page = 1, limit = 10 } = req.query;

    const where = {};
    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        rooms: true,
        images: true,
        reviews: true,
      },
      skip,
      take: parseInt(limit),
    });

    const hotelsMapped = hotels.map((hotel) => {
      const ratings = hotel.reviews.map((r) => r.score);
      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;

      return {
        id: hotel.hotel_id,
        image: hotel.main_image_url || (hotel.images[0]?.url ?? null),
        title: hotel.name,
        location: `${hotel.city}, ${hotel.address}`,
        price: `${hotel.rooms[0]?.price || 0} TL`,
        rating: avg || 0,
        reviews: hotel.reviews.length,
        tag: hotel.tag,
        amenities: hotel.amenities || [],
        description: hotel.description,
        address: hotel.address,
        phone: hotel.phone,
        email: hotel.email,
        website: hotel.website,
        checkIn: hotel.checkIn,
        checkOut: hotel.checkOut,
        policies: hotel.policies || [],
        images: hotel.images.map((img) => img.url),
        coordinates: {
          latitude: hotel.latitude,
          longitude: hotel.longitude,
        },
        category: hotel.category?.toLowerCase() || "hotel",
        stars: hotel.stars,
        facilities: hotel.facilities || [],
        roomTypes: hotel.rooms.map((room) => ({
          id: room.room_id,
          name: room.room_type,
          capacity: room.capacity,
          price: room.price,
          available: room.quantity > 0,
        })),
      };
    });

    const totalHotels = await prisma.hotel.count({ where });
    const totalPages = Math.ceil(totalHotels / parseInt(limit));

    res.json({
      success: true,
      data: hotelsMapped,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        count: hotels.length,
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Get hotels error:", err);
    res
      .status(500)
      .json({ success: false, error: "Oteller getirilirken hata oluştu" });
  }
});

// Returns a specific hotel by ID.
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const hotel = await prisma.hotel.findUnique({
      where: { hotel_id: id },
      include: {
        rooms: true,
        images: true,
        reviews: {
          include: { user: { select: { user_id: true, name: true } } },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({ success: false, error: "Otel bulunamadı" });
    }

    const ratings = hotel.reviews.map((r) => r.score);
    const avg =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

    res.json({
      success: true,
      data: {
        id: hotel.hotel_id,
        image: hotel.main_image_url || (hotel.images[0]?.url ?? null),
        title: hotel.name,
        location: `${hotel.city}, ${hotel.address}`,
        price: `${hotel.rooms[0]?.price || 0} TL`,
        rating: avg || 0,
        reviews: hotel.reviews.length,
        tag: hotel.tag,
        amenities: hotel.amenities || [],
        description: hotel.description,
        address: hotel.address,
        phone: hotel.phone,
        email: hotel.email,
        website: hotel.website,
        checkIn: hotel.checkIn,
        checkOut: hotel.checkOut,
        policies: hotel.policies || [],
        images: hotel.images.map((img) => img.url),
        coordinates: {
          latitude: hotel.latitude,
          longitude: hotel.longitude,
        },
        category: hotel.category?.toLowerCase() || "hotel",
        stars: hotel.stars,
        facilities: hotel.facilities || [],
        roomTypes: hotel.rooms.map((room) => ({
          id: room.room_id,
          name: room.room_type,
          capacity: room.capacity,
          price: room.price,
          available: room.quantity > 0,
        })),
        reviews_list: hotel.reviews.map((r) => ({
          id: r.review_id,
          score: r.score,
          comment: r.comment,
          user: r.user.name,
          created_at: r.created_at,
        })),
      },
    });
  } catch (err) {
    console.error("Get hotel error:", err);
    res
      .status(500)
      .json({ success: false, error: "Otel getirilirken hata oluştu" });
  }
});

// Creates a new hotel.
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["HOTEL_OWNER", "SUPPORT"]),
  async (req, res) => {
    try {
      const {
        name,
        city,
        address,
        description,
        tag,
        amenities,
        phone,
        email,
        website,
        checkIn,
        checkOut,
        policies,
        latitude,
        longitude,
        category,
        stars,
        facilities,
        owner_id,
      } = req.body;

      const { user_id, role } = req.user;
      const actualOwnerId =
        role === "SUPPORT" ? Number(owner_id || user_id) : Number(user_id);

      if (!name || !city || !address) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Otel adı, şehir ve adres zorunludur",
          });
      }

      const hotel = await prisma.hotel.create({
        data: {
          name,
          city,
          address,
          description,
          tag,
          amenities,
          phone,
          email,
          website,
          checkIn,
          checkOut,
          policies,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          category,
          stars: stars ? parseInt(stars) : null,
          facilities,
          owner_id: actualOwnerId,
        },
      });

      res
        .status(201)
        .json({
          success: true,
          message: "Otel başarıyla oluşturuldu",
          data: hotel,
        });
    } catch (err) {
      console.error("Create hotel error:", err);
      res
        .status(500)
        .json({ success: false, error: "Otel oluşturulurken hata oluştu" });
    }
  }
);

// Updates a hotel.
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { user_id, role } = req.user;

    const hotel = await prisma.hotel.findUnique({ where: { hotel_id: id } });
    if (!hotel)
      return res.status(404).json({ success: false, error: "Otel bulunamadı" });

    if (hotel.owner_id !== user_id && role !== "SUPPORT" && role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: "Bu oteli düzenleme yetkiniz yok" });
    }

    const updatedHotel = await prisma.hotel.update({
      where: { hotel_id: id },
      data: { ...req.body },
    });

    res.json({
      success: true,
      message: "Otel başarıyla güncellendi",
      data: updatedHotel,
    });
  } catch (err) {
    console.error("Update hotel error:", err);
    res
      .status(500)
      .json({ success: false, error: "Otel güncellenirken hata oluştu" });
  }
});

// Deletes a hotel.
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { user_id, role } = req.user;

    const hotel = await prisma.hotel.findUnique({ where: { hotel_id: id } });
    if (!hotel)
      return res.status(404).json({ success: false, error: "Otel bulunamadı" });

    if (hotel.owner_id !== user_id && role !== "SUPPORT" && role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: "Bu oteli silme yetkiniz yok" });
    }

    const activeReservations = await prisma.reservation.count({
      where: { hotel_id: id, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (activeReservations > 0) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Aktif rezervasyonu olan bir otel silinemez",
        });
    }

    await prisma.hotel.delete({ where: { hotel_id: id } });
    res.json({ success: true, message: "Otel başarıyla silindi" });
  } catch (err) {
    console.error("Delete hotel error:", err);
    res
      .status(500)
      .json({ success: false, error: "Otel silinirken hata oluştu" });
  }
});

export default router;
