import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getChatMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/messagesController.js";

const router = express.Router();

// Returns the messages of a chat
router.get("/:chatId/messages", authenticateToken, getChatMessages);

// Sends a message to a chat
router.post("/:chatId/messages", authenticateToken, sendMessage);
// Deletes a message
router.delete("/:messageId", authenticateToken, deleteMessage);

export default router;
