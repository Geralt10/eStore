# 🛍️ eStore — Luxury Fashion E-Commerce Platform

A modern, high-performance luxury fashion e-commerce platform built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js**, **Express**, and **MongoDB**. Inspired by premium editorial brands like Saint Laurent, Zara, Apple, and Massimo Dutti.

---

## ✨ Features

- **🎨 High-End Luxury Aesthetic**: Ultra-wide 4K cinematic editorial hero artwork, glassmorphism UI cards, dark charcoal theme with ambient lighting and micro-interactions.
- **🔐 Complete Authentication Flow**:
  - JWT-based cookie authentication & Redux state management.
  - Seamless **Register** & **Login** pages with responsive single-viewport (`100vh`) fit.
  - Role-based registration (**Buyer** vs **Seller** direct marketplace mode).
  - Password visibility toggles & frontend validation matching checks.
  - **Toast Notifications**: Built-in `react-hot-toast` notifications with gold luxury styling.
- **⚡ Responsive Layout**: Seamless adaptation across Mobile, Tablet, 1366×768 Laptop, and 4K Desktop viewports without awkward scrollbars.
- **🛡️ Robust Security & Validation**: Server-side request validation using `express-validator`, password hashing with `bcryptjs`, and HTTP-only JWT cookies.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7 (`react-router`)
- **Notifications**: React Hot Toast (`react-hot-toast`)
- **Typography**: Google Fonts (*Plus Jakarta Sans*)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
- **Validation**: `express-validator`
- **Security & Utilities**: `cors`, `dotenv`

---

## 📂 Project Structure

```text
eStore/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Route handlers (auth.controller.js)
│   │   ├── db/              # Database connection
│   │   ├── models/          # Mongoose schemas (user.model.js)
│   │   ├── routes/          # Express API routes (auth.routes.js)
│   │   ├── validators/      # Request validation (auth.validator.js)
│   │   └── app.js           # Express app setup
│   ├── server.js            # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Router & Redux store configuration
    │   ├── assets/          # 4K hero background artwork & graphics
    │   ├── features/
    │   │   └── auth/        # Auth state, services, hooks & pages (Register.jsx, Login.jsx)
    │   ├── index.css        # Global CSS & Tailwind configuration
    │   └── main.jsx         # React application entry point
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/estore
JWT_SECRET=your_super_secret_jwt_key
```

Run backend in development mode:

```bash
npm run dev
```

The server will start listening at `http://localhost:3000`.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Run frontend in development mode:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | `{ fullname, email, password, contact, isSeller }` |
| `POST` | `/api/auth/login` | Login user & issue JWT cookie | `{ email, password }` |

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
