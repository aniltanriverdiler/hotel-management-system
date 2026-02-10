import prisma from "../config/db.js";

// Export Message model directly from Prisma
export const Message = prisma.message;
