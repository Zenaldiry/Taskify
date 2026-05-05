# 🚀 Taskify

A full-stack, production-ready Task Management application built to demonstrate modern MERN stack architecture, strict TypeScript typing, and enterprise-grade security.

## ✨ Features

- **Secure Authentication:** JWT-based auth using HTTP-only cookies to prevent XSS attacks.
- **Optimistic UI Updates:** Lightning-fast frontend interactions with Zustand global state.
- **Advanced Form Handling:** Zero-re-render forms with built-in validation using React Hook Form.
- **Automated Testing:** Full integration testing suites for both the frontend (Vitest/RTL) and backend (Jest/Supertest).
- **Responsive Design:** Beautiful, mobile-first UI built with Tailwind CSS v4.

## 🛠️ Tech Stack

**Frontend:**

- React 19 (Vite)
- TypeScript
- Tailwind CSS v4
- Zustand (Global State)
- React Hook Form
- Vitest & React Testing Library

**Backend:**

- Node.js & Express 5
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Jest & Supertest (Integration Testing)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- MongoDB Atlas Cluster (or local MongoDB)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/taskify-mern.git
   cd taskify-mern
   ```

2. **Setup the Backend:**

   ```bash
   cd server
   pnpm install
   ```

   _Create a `.env` file in the backend directory:_

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   MONGO_URI_TEST=your_mongodb_test_connection_string
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```

3. **Setup the Frontend:**

   ```bash
   cd ../frontend
   pnpm install
   ```

4. **Run the Application:**
   _Open two terminals:_

   ```bash
   # Terminal 1 (Backend )
   cd server
   pnpm run dev

   # Terminal 2 (Frontend)
   cd frontend
   pnpm run dev
   ```
