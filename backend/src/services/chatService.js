import prisma from "../config/db.js";

/**
 * Finds or creates a 1-1 chat between two users.
 * Works regardless of the 3 roles (CUSTOMER, HOTEL_OWNER, SUPPORT).
 * Does not create another chat for the same pair (returns existing if found).
 * @param {number} userIdA
 * @param {number} userIdB
 * @returns {Promise<Object>} chat
 */
export const findOrCreateDirectChat = async (userIdA, userIdB) => {
  if (String(userIdA) === String(userIdB)) {
    throw new Error("Kendinizle sohbet başlatamazsınız");
  }

  //  First check whether there is a chat where both users are participants
  const existing = await prisma.chat.findFirst({
    where: {
      AND: [
        { participants: { some: { user_id: userIdA } } },
        { participants: { some: { user_id: userIdB } } },
      ],
    },
    select: { chat_id: true },
  });

  if (existing) return existing;

  //  Otherwise, fetch the users from the DB
  const [userA, userB] = await Promise.all([
    prisma.user.findUnique({
      where: { user_id: userIdA },
      select: { user_id: true, role: true },
    }),
    prisma.user.findUnique({
      where: { user_id: userIdB },
      select: { user_id: true, role: true },
    }),
  ]);

  if (!userA) throw new Error(`Kullanıcı bulunamadı: ID ${userIdA}`);
  if (!userB) throw new Error(`Kullanıcı bulunamadı: ID ${userIdB}`);

  //  Create the chat and add participants
  const chat = await prisma.chat.create({
    data: {
      participants: {
        create: [{ user_id: userA.user_id }, { user_id: userB.user_id }],
      },
    },
    select: { chat_id: true },
  });

  return chat;
};

/**
 * Checks whether the user is a chat participant.
 * @param {number} userId
 * @param {number} chatId
 * @returns {Promise<boolean>}
 */
export const isUserParticipantOfChat = async (userId, chatId) => {
  if (Number.isNaN(userId) || Number.isNaN(chatId)) {
    throw new Error(
      "Geçersiz kullanıcı veya sohbet ID'si. Lütfen geçerli bir ID sağlayın."
    );
  }

  const count = await prisma.chatParticipant.count({
    where: { chat_id: chatId, user_id: userId },
  });

  return count > 0;
};

/**
 * Returns the IDs of the "other" participants in a chat.
 * @param {number} chatId
 * @param {number} requesterId
 * @returns {Promise<number[]>}
 */
export const getCounterpartIds = async (chatId, requesterId) => {
  if (Number.isNaN(chatId) || Number.isNaN(requesterId)) {
    throw new Error(
      "Geçersiz sohbet veya kullanıcı ID'si. Lütfen geçerli bir ID sağlayın."
    );
  }

  const parts = await prisma.chatParticipant.findMany({
    where: { chat_id: chatId },
    select: { user_id: true },
  });

  return parts
    .map((p) => p.user_id)
    .filter((id) => String(id) !== String(requesterId));
};
