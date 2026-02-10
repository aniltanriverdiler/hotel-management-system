# 🏨 Hotel Management System

This repository contains a **full‑stack hotel reservation and management system** built as a collaborative internship project.  
The application provides **hotel search & filtering, booking, reviews, dashboards, and real‑time support chat** with a modern UI and production‑ready backend.

---

## 🚀 Live Demo & Source Code

> Live deployment can be configured with platforms like **Vercel (frontend)** and **Railway/Render (backend)**.

- 💻 **GitHub Repository (this project):**  
  [`https://github.com/aniltanriverdiler/hotel-management-system`](https://github.com/aniltanriverdiler/hotel-management-system)

---

## ✨ Features

### 🧳 Core Booking & Hotel Management
- ✅ **Hotel listing & search**: Browse hotels with filters (location, price, rating, facilities, etc.).
- ✅ **Hotel details page**: Photos, description, room types, amenities, rating, and reviews.
- ✅ **Room availability & pricing**: See available rooms and prices for selected dates.
- ✅ **Reservation flow**: Select dates, guests, room type, and confirm booking.
- ✅ **Booking history**: Users can view and manage their previous and upcoming reservations.
- ✅ **Cancellation / modification support** (depending on backend rules and API implementation).

### 👤 User & Role System
- 🔑 **Authentication with JWT**: Secure login & registration.
- 👥 **Role‑based access control**:
  - `CUSTOMER` – search, book, review, and chat with support/hotels.
  - `HOTEL_OWNER` – manage hotels, rooms, availability, and see reservations.
  - `SUPPORT / ADMIN` – handle support tickets, monitor chats, and have elevated access.
- 👤 **Profile management**: Basic user information and preferences.
- 🔐 **Protected routes**: Frontend pages and backend endpoints are guarded with JWT middleware.

### 💬 Real‑Time Chat & Support
- ⚡ **Socket.IO based real‑time communication** between:
  - Customer ↔ Hotel owner
  - Customer ↔ Support
- 💬 **1‑1 private chats** and **general support channels**.
- 🟢 **Online / offline presence**: Track when a user, hotel owner, or support agent is online.
- ✉️ **Typing status, join/leave events, and new message notifications**.
- 🧪 **Automated tests** for chat & message modules in the backend.

### ⭐ Reviews & Ratings
- ✍️ **Write reviews** for hotels after a stay.
- ⭐ **Rating system** stored in the backend.
- 📊 Hotel ratings can be surfaced on the hotel list and detail pages.

### 🖥️ Dashboards & Admin Features
- 📊 **Owner dashboard**:
  - Manage hotel details and rooms.
  - Inspect reservations and customer information (within allowed scope).
- 🛠️ **Support / admin tools**:
  - Monitor active chats and user issues.
  - Perform support actions via APIs and dashboard UI (depending on frontend implementation).

### 🎨 UI & UX
- 🌗 **Dark/Light mode** with theme toggle.
- 📱 **Responsive, mobile‑first design**.
- ✨ **Modern interface** built with **TailwindCSS** and **shadcn/ui**.
- 🧭 Clear navigation for:
  - Home / Explore hotels
  - My bookings
  - Hotel management
  - Support / Chat

---

## 📂 Project Structure

Monorepo style at the root:

```bash
hotel-management-system/
├─ backend/                 # Node.js + Express API (Prisma + PostgreSQL)
│  ├─ src/
│  │  ├─ config/            # DB config, env handling
│  │  ├─ controllers/       # Express controllers (auth, hotel, room, reservation, review, chat, message, user, support...)
│  │  ├─ middlewares/       # JWT auth, role-based guards, error handling
│  │  ├─ models/            # Prisma models (Chat, ChatParticipant, Message, User, Hotel, Room, Reservation, Review, ...)
│  │  ├─ routes/            # Express routers (authRoutes, hotelRoutes, roomRoutes, reservationRoutes, reviewRoutes, userRoutes, chatRoutes, messageRoutes, imageRoutes, supportRoutes)
│  │  ├─ services/          # Business logic layer (hotelService, roomService, reservationService, userService, authService, chatService, messageService, ...)
│  │  ├─ tests/             # Jest tests (user.test, room.test, reservation.test, message.test, socket.test, hotel.test, ...)
│  │  ├─ utils/             # Helpers (socketHandler, error helpers, etc.)
│  │  └─ server.js          # Express app & Socket.IO server bootstrap
│  ├─ prisma/
│  │  └─ schema.prisma      # Prisma schema for PostgreSQL
│  ├─ JWT_MIDDLEWARE_README.md  # Docs for JWT middleware usage
│  ├─ BACKEND_README.md     # Backend‑specific notes and changelog
│  └─ .env                  # Backend environment variables (ignored by git)
│
├─ frontend/                # Next.js 15 application
│  ├─ src/
│  │  ├─ app/               # App Router pages (home, hotel pages, auth pages, dashboards, etc.)
│  │  ├─ components/        # Reusable UI components
│  │  ├─ hooks/             # Custom hooks (useAuth, useHotels, useBooking, useChat, useSocket, ...)
│  │  ├─ services/          # API clients (apiService, socketService, etc.)
│  │  ├─ types/             # Shared TypeScript types (hotel, booking, user, socket, ...)
│  │  ├─ data/              # Static or mock data where needed
│  │  ├─ lib/               # Schemas & utilities (validation, helpers)
│  │  └─ utils/             # Frontend helpers (auth utils, formatting, etc.)
│  ├─ public/               # Static assets
│  ├─ tsconfig.json
│  ├─ tailwind.config.ts
│  └─ next.config.mjs
│
├─ package.json             # Root config (can also be used as workspace root)
├─ pnpm-lock.yaml / package-lock.json
└─ README.md                # You are here
```

---

## 🛠️ Installation & Run

You can run backend and frontend separately during development.

### 1️⃣ Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** or **npm**  
- **PostgreSQL** database instance

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/aniltanriverdiler/hotel-management-system.git
cd hotel-management-system
```

### 3️⃣ Backend Setup (`/backend`)

```bash
cd backend

# Install dependencies
pnpm install        # or: npm install

# Configure environment
cp .env.example .env   # if available, otherwise create .env manually
# Edit .env with your DB connection string, JWT secrets, Cloudinary, etc.

# Run Prisma migrations & generate client
pnpm prisma migrate dev
pnpm prisma generate

# Start development server
pnpm dev              # or: npm run dev
```

Backend will typically run on `http://localhost:3001` (check `server.js` / `.env`).

### 4️⃣ Frontend Setup (`/frontend`)

Open a new terminal:

```bash
cd frontend

# Install dependencies
pnpm install        # or: npm install

# Start Next.js dev server
pnpm dev            # or: npm run dev
```

Frontend will typically run on `http://localhost:3000` (check `package.json` / Next config).

Make sure the **backend API URL** and **Socket.IO URL** configured in the frontend match your backend host/port.

---

## 🏗️ Tech Stack

### Frontend
- ⚛ **Next.js 15** – App Router, server components, and modern React features.
- 🟦 **TypeScript** – Type‑safe development across the codebase.
- 🎨 **Tailwind CSS** – Utility‑first styling.
- 🧩 **shadcn/ui** – Re‑usable, accessible UI components.
- 🗂 **Zustand** – Lightweight state management.
- 🔌 **Socket.IO Client** – Real‑time communication with the backend.
- ✅ **Zod / validation schemas** (via `lib/schemas.ts`) for forms and API contracts.

### Backend
- 🟩 **Node.js + Express** – RESTful API server.
- 🗃 **PostgreSQL** – Relational database for hotels, rooms, reservations, users, messages, etc.
- 🧬 **Prisma ORM** – Type‑safe database access and migrations.
- 🔐 **JWT Authentication** – Access tokens with role‑based authorization middleware.
- 🔌 **Socket.IO** – Real‑time bidirectional communication for chat and presence.
- 🧪 **Jest** – Automated tests for controllers, services, and Socket.IO behavior.
- ☁ **Cloudinary** (optional) – For image uploads (hotel photos, avatars).

### Tooling & Dev Experience
- 📦 **pnpm / npm** – Package management.
- 🧹 **ESLint & Prettier** (optional, recommended) – Code quality and formatting.

---

## 🎮 How to Use

> High‑level user journey in production usage.

1️⃣ **Sign Up / Log In**  
- New users register as customers.  
- Hotel owners and support/admin roles can be seeded or upgraded via backend tools.

2️⃣ **Explore Hotels**  
- Browse hotels from the homepage.  
- Filter by location, price, capacity, rating, and more (depending on implemented filters).

3️⃣ **View Hotel Details**  
- See photos, amenities, room types, availability, reviews, and rating.  
- Choose dates, number of guests, and a room type.

4️⃣ **Create a Reservation**  
- Confirm booking details and submit.  
- Reservation is persisted in PostgreSQL via the backend API.  
- Bookings can later be viewed in **“My Reservations / Bookings”**.

5️⃣ **Chat with Support / Hotel Owner**  
- Open the chat / support section.  
- Start a general support chat or a private chat tied to a hotel/reservation.  
- Messages are delivered in real‑time using Socket.IO.

6️⃣ **Leave a Review**  
- After a stay, the customer can add a rating & review for the hotel.  
- Reviews will contribute to the hotel’s overall rating.

7️⃣ **Owner & Support Workflows**  
- Hotel owners manage hotels, rooms, and reservations from dedicated views.  
- Support/admins monitor and respond to chats, debug issues, and support users.

---

## 🚀 Key Pages

> Exact routes may differ depending on your Next.js routing structure, but conceptually:

- **🏠 Home / Hotels** – Landing page with featured hotels and search.
- **🏨 Hotel Details** – Detailed hotel information, rooms, availability, and reviews.
- **📅 My Bookings** – List of upcoming and past reservations for the logged‑in customer.
- **👤 Auth Pages** – Login, Register, and possibly Password reset.
- **🧑‍💼 Owner Dashboard** – Manage hotels, rooms, and reservations.
- **🛟 Support / Chat** – Real‑time messaging interface (customer ↔ support / owner).
- **⚙️ Settings / Profile** – User profile, language/theme preferences, etc.

---

## 📌 Technical Notes

- **Full‑stack architecture** with clear separation:
  - Backend (`/backend`) for REST APIs, auth, DB, and Socket.IO server.
  - Frontend (`/frontend`) for SSR/CSR, UI, and client‑side state.
- **JWT middleware** handles:
  - Authentication (token verification).
  - Role‑based authorization via helpers (e.g., `authorizeRoles`, `authorizeOwnResource`).
- **Socket.IO integration**:
  - Central `socketHandler` on the backend for connection, events, and presence.
  - `useSocket` and `socketService` on the frontend for stable, reconnecting connections.
- **Testing**:
  - Jest tests for core flows such as Auth, Hotels, Reservations, Messages, and Socket events.
- **Environment variables**:
  - `.env` files are used to configure DB, JWT, email, and cloud providers.
  - `.env` files **must never be committed**; they are git‑ignored.

---

## 🤝 Contributing

💡 Have an idea or found a bug?

- 🍴 **Fork the repository**
- 🌿 **Create a feature branch** (`git checkout -b feature/amazing-feature`)
- 💻 **Make your changes** and test thoroughly (backend + frontend if applicable)
- 📝 **Commit your changes** (`git commit -m 'Add amazing feature'`)
- 🚀 **Push to the branch** (`git push origin feature/amazing-feature`)
- 🔄 **Open a Pull Request**

### Development Guidelines

- Follow the existing file structure and naming conventions (services, routes, controllers, hooks).
- Keep business logic in **services** (backend) and **hooks/services** (frontend), not in components/controllers.
- Add/extend tests in `/backend/src/tests` and relevant frontend test locations.
- Update documentation when you change APIs, routes, or major flows.
- Ensure components and pages remain responsive.

🚀 **Let’s improve the Hotel Management System together!**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open Source Community** – For the amazing libraries and tools.
- **Next.js & React Teams** – For the core framework and ecosystem.
- **Tailwind CSS & shadcn/ui** – For the modern, flexible UI foundations.
- **Prisma Team** – For the excellent TypeScript ORM.
- **All Contributors** – Who help make this project better.