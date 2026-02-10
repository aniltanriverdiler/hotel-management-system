import express from "express";
import prisma from "../config/db.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Creates a new review for a hotel
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { hotel_id, score, comment } = req.body;
    const user_id = req.user.user_id;

    if (!hotel_id || !score) {
      return res.status(400).json({
        success: false,
        error: "Hotel ID ve score zorunludur",
      });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        error: "Score 1 ile 5 arasında olmalıdır",
      });
    }

    const review = await prisma.review.create({
      data: {
        hotel_id: Number(hotel_id),
        user_id: Number(user_id),
        score,
        comment,
      },
      include: {
        user: { select: { user_id: true, name: true } },
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    console.error("Create review error:", err);
    res
      .status(500)
      .json({ success: false, error: "Yorum eklenirken hata oluştu" });
  }
});

// Returns the reviews of a hotel
router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { hotel_id: Number(hotelId) },
      include: {
        user: { select: { user_id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("Get hotel reviews error:", err);
    res
      .status(500)
      .json({ success: false, error: "Yorumlar getirilirken hata oluştu" });
  }
});

// Updates the review of the user
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;
    const user_id = req.user.user_id;

    const review = await prisma.review.findUnique({
      where: { review_id: Number(id) },
    });
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Yorum bulunamadı" });
    }

    if (review.user_id !== user_id) {
      return res
        .status(403)
        .json({ success: false, error: "Bu yorumu güncelleme yetkiniz yok" });
    }

    const updated = await prisma.review.update({
      where: { review_id: Number(id) },
      data: {
        score: score ?? review.score,
        comment: comment ?? review.comment,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update review error:", err);
    res
      .status(500)
      .json({ success: false, error: "Yorum güncellenirken hata oluştu" });
  }
});

// Deletes a review
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const review = await prisma.review.findUnique({
      where: { review_id: Number(id) },
    });
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Yorum bulunamadı" });
    }

    if (review.user_id !== user_id) {
      return res
        .status(403)
        .json({ success: false, error: "Bu yorumu silme yetkiniz yok" });
    }

    await prisma.review.delete({ where: { review_id: Number(id) } });
    res.json({ success: true, message: "Yorum başarıyla silindi" });
  } catch (err) {
    console.error("Delete review error:", err);
    res
      .status(500)
      .json({ success: false, error: "Yorum silinirken hata oluştu" });
  }
});

export default router;
