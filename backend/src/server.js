import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import prisma from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";

import {
  findOrCreateDirectChat,
  isUserParticipantOfChat,
  getCounterpartIds,
} from "./services/chatService.js";
import { saveMessage } from "./services/messageService.js";
import imageRoutes from "./routes/imageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
const server = http.createServer(app);

// CORS
const origins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
  : "*";

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());

// REST routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (_req, res) => res.send("API çalışıyor"));

// Socket.io
const io = new Server(server, {
  cors: { origin: origins, methods: ["GET", "POST"] },
});
app.set("io", io);

// Socket JWT validation (handshake)
io.use(async (socket, next) => {
  try {
    const bearer =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization ||
      socket.handshake.query?.token;

    const tokenStr = typeof bearer === "string" ? bearer : "";
    const token = tokenStr.startsWith("Bearer ") ? tokenStr.slice(7) : tokenStr;

    if (!token)
      return next(new Error("(UNAUTHORIZED)Token eksik. Lütfen giriş yapın"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.user_id || !decoded?.role)
      return next(
        new Error("(UNAUTHORIZED)Geçersiz token. Lütfen tekrar giriş yapın.")
      );

    const user = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
      select: { user_id: true, role: true, name: true },
    });
    if (!user)
      return next(
        new Error(
          "(UNAUTHORIZED)Kullanıcı bulunamadı. Lütfen tekrar giriş yapın."
        )
      );

    socket.user = {
      user_id: user.user_id,
      role: user.role,
      name: user.name || "User",
    };
    next();
  } catch {
    next(new Error("(UNAUTHORIZED)Token doğrulama sırasında bir hata oluştu."));
  }
});

// Socket connection
const onlineUsers = new Map(); // key: userId, value: socket.id
io.on("connection", (socket) => {
  const { user_id: userId, role, name } = socket.user;
  console.log(`🔌 Connected: ${name} (${role}) #${userId}`);

  // User online
  onlineUsers.set(userId, socket.id);
  prisma.user
    .update({ where: { user_id: userId }, data: { is_online: true } })
    .then(() => {
      console.log(` ${name} (#${userId}) artık ONLINE`);
    })
    .catch(console.error);

  socket.join(`notify:${userId}`);

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${name} (${role}) #${userId}`);
    onlineUsers.delete(userId);
    prisma.user
      .update({ where: { user_id: userId }, data: { is_online: false } })
      .then(() => console.log(` ${name} (#${userId}) artık OFFLINE`))
      .catch(console.error);
  });
  // Chat join
  socket.on("chat:join", async ({ targetUserId }, ack) => {
    try {
      if (!targetUserId) throw new Error("targetUserId gerekli");
      if (String(targetUserId) === String(userId))
        throw new Error("Kendinizle sohbet başlatamazsınız");

      const chat = await findOrCreateDirectChat(
        Number(userId),
        Number(targetUserId)
      );
      const chatId = chat.chat_id;

      const allowed = await isUserParticipantOfChat(userId, chatId);
      if (!allowed) throw new Error("Sohbete erişim yetkiniz yok");

      socket.join(`chat:${chatId}`);
      console.log(` ${name} (#${userId}) chat:${chatId} odasına katıldı`);
      ack?.({ ok: true, chatId });
    } catch (err) {
      console.error("chat:join error", err);
      ack?.({ ok: false, error: err.message });
    }
  });

  // Message send
  socket.on("message:send", async ({ chatId, content }, ack) => {
    try {
      const chatIdNum = parseInt(chatId, 10);
      if (!chatIdNum || !content?.trim())
        throw new Error("Geçerli bir chatId ve mesaj içeriği gerekli.");
      // Check if the user is a participant of the chat
      const allowed = await isUserParticipantOfChat(userId, chatIdNum);
      if (!allowed) throw new Error("Bu sohbete mesaj gönderme yetkiniz yok");

      // Save the message
      const saved = await saveMessage({
        chatId: chatIdNum,
        senderId: userId,
        text: content.trim(),
      });
      // Send the message to all participants
      io.to(`chat:${chatIdNum}`).emit("message:new", saved);
      console.log(
        ` ${name} (#${userId}) chat:${chatIdNum} mesaj gönderdi: "${content.trim()}"`
      );
      // Get the counterpart ids
      const others = await getCounterpartIds(chatIdNum, userId);

      // Send the notification to the counterpart
      others.forEach((otherId) => {
        io.to(`notify:${otherId}`).emit("notify:new-message", {
          chatId: chatIdNum,
          messageId: saved.message_id,
          from: userId,
        });
      });

      // Check if the user is offline
      for (const otherId of others) {
        if (onlineUsers.has(otherId)) continue;

        const user = await prisma.user.findUnique({
          where: { user_id: Number(otherId) },
          select: { is_online: true, role: true, name: true },
        });

        if (user && !user.is_online) {
          let title = "",
            messageText = "";

          if (user.role === "SUPPORT") {
            title = "Destek Hattı Çevrimdışı";
            messageText =
              "Destek ekibimiz şu anda çevrimdışı. En kısa sürede size geri dönüş yapacağız. Anlayışınız için teşekkür ederiz.";
          } else if (user.role === "HOTEL_OWNER") {
            title = "Otel Sahibi Çevrimdışı";
            messageText =
              "Otel sahibi şu anda çevrimdışı. Mesajınızı aldık, uygun olduğunda size dönüş yapılacaktır.";
          }

          if (title && messageText) {
            socket.emit("system:info", {
              type: "offline",
              title,
              message: messageText,
              toUserId: userId, // Send the message to the user
            });
          }
        }
      }

      ack?.({ ok: true, message: saved });
    } catch (err) {
      console.error("message:send error", err);
      ack?.({ ok: false, error: err.message });
    }
  });

  // Typing
  socket.on("typing", ({ chatId, typing }) => {
    const chatIdNum = parseInt(chatId, 10);
    if (!chatIdNum) return;
    socket.to(`chat:${chatIdNum}`).emit("typing", { userId, typing: !!typing });
    console.log(
      ` ${name} (#${userId}) chat:${chatIdNum} ${
        typing ? "yazıyor..." : "yazmayı bıraktı"
      }`
    );
  });
});
const PORT = process.env.PORT || 3000;
server
  .listen(PORT, () => {
    console.log(`✅ Server http://localhost:${PORT} üzerinde çalışıyor`);
  })
  .on("error", (err) => {
    console.error("❌ Server başlatılamadı:", err);
  });
