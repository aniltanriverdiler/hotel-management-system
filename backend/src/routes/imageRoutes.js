import express from "express";
import multer from "multer";
import prisma from "../config/db.js";
import { supabase } from "../config/supabase.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB upload limit
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Sadece görsel yükleyebilirsiniz"));
    }
    cb(null, true);
  },
});

const BUCKET = process.env.SUPABASE_BUCKET || "hotel-images";

async function uploadToSupabase(path, file) {
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

async function removeFromSupabase(paths = []) {
  if (!paths.length) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) throw error;
}

// Returns the main image and gallery images of the hotel
router.get("/:hotelId", async (req, res) => {
  try {
    const hotelId = Number(req.params.hotelId);

    const hotel = await prisma.hotel.findUnique({
      where: { hotel_id: hotelId },
      select: {
        hotel_id: true,
        main_image_url: true,
        images: {
          select: {
            image_id: true,
            url: true,
            storage_path: true,
            created_at: true,
          },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({ success: false, error: "Otel bulunamadı" });
    }

    res.json({ success: true, data: hotel });
  } catch (err) {
    console.error("Get hotel images error:", err);
    res
      .status(500)
      .json({ success: false, error: "Görseller getirilirken hata oluştu" });
  }
});

// Uploads the main image of the hotel (deletes the old one if it exists)
router.post(
  "/:hotelId/main",
  authenticateToken,
  authorizeRoles(["HOTEL_OWNER", "SUPPORT"]),
  upload.single("mainImage"),
  async (req, res) => {
    try {
      const hotelId = Number(req.params.hotelId);
      const file = req.file;

      if (!file)
        return res
          .status(400)
          .json({ success: false, error: "Dosya yüklenmedi" });

      const hotel = await prisma.hotel.findUnique({
        where: { hotel_id: hotelId },
      });
      if (!hotel)
        return res
          .status(404)
          .json({ success: false, error: "Otel bulunamadı" });

      // Owner control (SUPPORT is always allowed)
      if (req.user.role !== "SUPPORT" && hotel.owner_id !== req.user.user_id) {
        return res
          .status(403)
          .json({ success: false, error: "Bu otel için yetkiniz yok" });
      }

      // If the old main image exists, delete it and upload the new one
      if (hotel.main_image_path) {
        await removeFromSupabase([hotel.main_image_path]);
      }

      const fileName = `hotels/${hotelId}/main_${Date.now()}_${
        file.originalname
      }`;
      const { url, path } = await uploadToSupabase(fileName, file);

      const updated = await prisma.hotel.update({
        where: { hotel_id: hotelId },
        data: { main_image_url: url, main_image_path: path },
      });

      res.json({
        success: true,
        message: "Ana görsel yüklendi",
        data: { main_image_url: updated.main_image_url },
      });
    } catch (err) {
      console.error("Upload main image error:", err);
      res.status(500).json({ success: false, error: "Ana görsel yüklenemedi" });
    }
  }
);

// Deletes the main image of the hotel
router.delete(
  "/:hotelId/main",
  authenticateToken,
  authorizeRoles(["HOTEL_OWNER", "SUPPORT"]),
  async (req, res) => {
    try {
      const hotelId = Number(req.params.hotelId);

      const hotel = await prisma.hotel.findUnique({
        where: { hotel_id: hotelId },
      });
      if (!hotel)
        return res
          .status(404)
          .json({ success: false, error: "Otel bulunamadı" });

      if (req.user.role !== "SUPPORT" && hotel.owner_id !== req.user.user_id) {
        return res
          .status(403)
          .json({ success: false, error: "Bu otel için yetkiniz yok" });
      }

      if (hotel.main_image_path)
        await removeFromSupabase([hotel.main_image_path]);

      await prisma.hotel.update({
        where: { hotel_id: hotelId },
        data: { main_image_url: null, main_image_path: null },
      });

      res.json({ success: true, message: "Ana görsel silindi" });
    } catch (err) {
      console.error("Delete main image error:", err);
      res.status(500).json({ success: false, error: "Ana görsel silinemedi" });
    }
  }
);

// Uploads multiple gallery images of the hotel
router.post(
  "/:hotelId/gallery",
  authenticateToken,
  authorizeRoles(["HOTEL_OWNER", "SUPPORT"]),
  upload.array("images", 10),
  async (req, res) => {
    try {
      const hotelId = Number(req.params.hotelId);
      const files = req.files || [];

      if (files.length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Resim yüklenmedi" });
      }

      const hotel = await prisma.hotel.findUnique({
        where: { hotel_id: hotelId },
      });
      if (!hotel)
        return res
          .status(404)
          .json({ success: false, error: "Otel bulunamadı" });

      if (req.user.role !== "SUPPORT" && hotel.owner_id !== req.user.user_id) {
        return res
          .status(403)
          .json({ success: false, error: "Bu otel için yetkiniz yok" });
      }

      const created = [];
      for (const file of files) {
        const fileName = `hotels/${hotelId}/gallery/${Date.now()}_${
          file.originalname
        }`;
        const { url, path } = await uploadToSupabase(fileName, file);

        const img = await prisma.image.create({
          data: { hotel_id: hotelId, url, storage_path: path },
          select: {
            image_id: true,
            url: true,
            storage_path: true,
            created_at: true,
          },
        });

        created.push(img);
      }

      res.json({
        success: true,
        message: "Galeri görselleri eklendi",
        data: created,
      });
    } catch (err) {
      console.error("Upload gallery images error:", err);
      res.status(500).json({ success: false, error: "Galeri yüklenemedi" });
    }
  }
);

// Deletes a single gallery image
router.delete(
  "/gallery/:imageId",
  authenticateToken,
  authorizeRoles(["HOTEL_OWNER", "SUPPORT"]),
  async (req, res) => {
    try {
      const imageId = Number(req.params.imageId);

      const image = await prisma.image.findUnique({
        where: { image_id: imageId },
        include: { hotel: true },
      });

      if (!image) {
        return res
          .status(404)
          .json({ success: false, error: "Görsel bulunamadı" });
      }

      // Permission control (SUPPORT is always allowed)
      if (
        req.user.role !== "SUPPORT" &&
        image.hotel.owner_id !== req.user.user_id
      ) {
        return res
          .status(403)
          .json({ success: false, error: "Bu görsel için yetkiniz yok" });
      }
      await removeFromSupabase([image.storage_path]);

      await prisma.image.delete({ where: { image_id: imageId } });

      res.json({ success: true, message: "Görsel silindi" });
    } catch (err) {
      console.error("Delete gallery image error:", err);
      res.status(500).json({ success: false, error: "Görsel silinemedi" });
    }
  }
);

export default router;
