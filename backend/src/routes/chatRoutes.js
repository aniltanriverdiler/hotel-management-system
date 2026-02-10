import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  startDirectChat,
  verifyParticipation,
  getCounterparts,
} from "../controllers/chatController.js";

const router = express.Router();

// Starts a 1-on-1 chat or returns an existing one
router.post("/start", authenticateToken, startDirectChat);

// Checks if the user is a participant of the specified chat
router.get("/:chatId/verify", authenticateToken, verifyParticipation);

// Returns the other participants of a chat
router.get("/:chatId/counterparts", authenticateToken, getCounterparts);

export default router;
