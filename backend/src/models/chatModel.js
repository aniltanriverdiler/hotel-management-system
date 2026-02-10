import prisma from "../config/db.js";

// Export Chat and ChatParticipant models directly from Prisma
export const Chat = prisma.chat;
export const ChatParticipant = prisma.chatParticipant;
