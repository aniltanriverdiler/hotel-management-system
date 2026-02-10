import prisma from "../config/db.js";

/**
 * Save message
 * @param {Object} param0
 * @param {number|string} param0.chatId - Chat ID the message belongs to
 * @param {number|string} param0.senderId - ID of the user who sends the message
 * @param {string} param0.text - Message content
 * @returns {Promise<Object>} Saved message object
 */
export const saveMessage = async ({ chatId, senderId, text }) => {
  // Type safety and empty message check
  chatId = Number(chatId);
  senderId = Number(senderId);
  text = text?.trim();

  if (isNaN(chatId)) {
    throw new Error(
      "Geçersiz chatId. Lütfen geçerli bir sohbet ID'si sağlayın."
    );
  }
  if (isNaN(senderId)) {
    throw new Error(
      "Geçersiz senderId. Lütfen geçerli bir kullanıcı ID'si sağlayın."
    );
  }
  if (!text) {
    throw new Error("Mesaj içeriği boş olamaz. Lütfen bir mesaj girin.");
  }

  // Find the sender user and get their role
  const sender = await prisma.user.findUnique({
    where: { user_id: senderId },
    select: { role: true, name: true },
  });
  if (!sender) throw new Error("Gönderen kullanıcı bulunamadı");

  // Create the message
  const msg = await prisma.message.create({
    data: {
      chat_id: chatId,
      sender_id: senderId,
      content: text,
    },
    include: {
      sender: {
        select: { user_id: true, name: true, role: true },
      },
    },
  });

  return msg;
};

/**
 * Get chat messages (ASC)
 * @param {number|string} chatId - Chat ID the messages belong to
 * @param {Object} options
 * @param {number} options.take - How many messages will be fetched (default: 100)
 * @param {number|string} options.cursor - Message ID for cursor-based pagination
 * @returns {Promise<Object[]>} Message list
 */
export const getMessagesByChatId = async (
  chatId,
  { take = 100, cursor } = {}
) => {
  chatId = Number(chatId);
  cursor = cursor ? Number(cursor) : undefined;

  if (isNaN(chatId)) {
    throw new Error(
      "Geçersiz chatId. Lütfen geçerli bir sohbet ID'si sağlayın."
    );
  }
  if (cursor && isNaN(cursor)) {
    throw new Error(
      "Geçersiz cursor. Lütfen geçerli bir mesaj ID'si sağlayın."
    );
  }
  return prisma.message.findMany({
    where: { chat_id: chatId },
    orderBy: { created_at: "asc" },
    take,
    ...(cursor ? { cursor: { message_id: cursor }, skip: 1 } : {}),
    include: {
      sender: { select: { user_id: true, name: true, role: true } },
    },
  });
};
