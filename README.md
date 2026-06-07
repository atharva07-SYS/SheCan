# She Can Connect

She Can Connect is a modern, premium web platform designed for the **She Can Foundation** — an NGO dedicated to empowering women through education, mentorship, and community programs.

Built as an internship task, this platform provides a beautiful, user-friendly interface for volunteers, donors, and general inquiries, paired with a secure admin dashboard to manage submissions.

## ✨ Features

- **Premium UI/UX:** Agency-grade editorial design with fluid typography, glassmorphism, and smooth scroll animations.
- **Dynamic Hero Section:** Highly responsive layout with overlapping image compositions tailored for ultra-wide monitors.
- **Secure Admin Dashboard:** JWT-based authentication for foundation staff to view, filter, and manage inquiries.
- **Interactive Forms:** Real-time validation for volunteer, donation, partnership, and general contact submissions.
- **RESTful API:** Robust Node.js/Express backend communicating with MongoDB.
- **Responsive Design:** Completely mobile-friendly with responsive navigations and grids.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v4
- Framer Motion
- React Router DOM
- Lucide Icons
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atharva07-SYS-SheCan.git
   cd atharva07-SYS-SheCan
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
   Seed the admin user and start the server:
   ```bash
   npm run seed
   npm run dev
   ```

3. **Setup Frontend**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **View the App**
   Open `http://localhost:5173` in your browser.
   To access the admin dashboard, login with the seeded admin credentials at `/login`.

## 🎨 Design Philosophy
The UI was heavily inspired by premium, editorial web aesthetics. We used:
- **Playfair Display (Serif)** paired with **Inter (Sans-serif)** to create an elegant hierarchy.
- A **purple and rose** gradient color scheme to represent empowerment, warmth, and vitality.
- **Fluid containers** that scale gracefully on massive ultra-wide monitors while remaining perfectly legible on mobile devices.

## 📄 License
This project was built for the She Can Foundation internship task.
