import {
  findOrCreateDirectChat,
  isUserParticipantOfChat,
  getCounterpartIds,
} from "../services/chatService.js";
// Starts a 1-1 chat or returns existing chat between two users.
export const startDirectChat = async (req, res) => {
  try {
    const userId = req.user.user_id; // auth middleware from socket or JWT
    const { targetUserId } = req.body;

    if (!targetUserId || Number.isNaN(Number(targetUserId))) {
      return res
        .status(400)
        .json({ ok: false, error: "Geçerli bir targetUserId gerekli" });
    }
    const chat = await findOrCreateDirectChat(userId, Number(targetUserId));
    return res.json({ ok: true, chat });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// Checks if the user is a participant of the specified chat.
export const verifyParticipation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const chatId = Number(req.params.chatId);

    const allowed = await isUserParticipantOfChat(userId, chatId);
    return res.json({ ok: true, allowed });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// Returns the other participants of a chat.
export const getCounterparts = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const chatId = Number(req.params.chatId);

    const ids = await getCounterpartIds(chatId, userId);
    return res.json({ ok: true, counterparts: ids });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
