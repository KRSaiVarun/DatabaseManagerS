# 🚁 Vayu Vihara – Online Helicopter Booking Platform

Vayu Vihara is a full-stack web application that enables real-time helicopter bookings from Bengaluru Airport (BLR) to approved helipads across the city. Designed for luxury, speed, and convenience, the platform provides seamless air travel experiences.


---

## ✨ Features

- 🛫 **Real-Time Helicopter Booking**
- 🗺️ **Interactive Map with Helipad Locations**
- 🔐 **JWT-Based User & Admin Authentication**
- 💳 **Secure Online Payments (Stripe / UPI / Cards)**
- 🧭 **Flight Scheduling & Route Selection**
- 📲 **Mobile Responsive UI**
- 🛠️ **Admin Dashboard for Bookings, Users & Routes**
- 📩 **Email & SMS Notifications**

---

## 🖥️ Tech Stack

### 🔹 Frontend
- React + Next.js
- Tailwind CSS + ShadCN UI
- TypeScript

### 🔹 Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM

### 🔹 DevOps
- GitHub Actions (CI/CD)
- Docker (Optional)
- Deployed on AWS / Vercel / Heroku

---

## 📁 Project Structure

```bash
├── client/           # Frontend React code (Next.js)
├── server/           # Backend Node.js/Express APIs
├── shared/           # Shared types & utilities
├── database/         # Prisma / Drizzle schema & config
├── public/           # Static assets
└── README.md
```

---

## 🔐 User Roles

| Role         | Permissions                                  |
|--------------|----------------------------------------------|
| 🚁 User       | Book flights, manage profile, view history   |
| 🧑‍✈️ Admin     | Manage helipads, flights, users, reports     |
| 🛬 Operator    | Update helipad statuses (optional)          |

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/vayu-vihara.git
cd vayu-vihara

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Run the development server
npm run dev
```

Visit `http://localhost:3000` to view the app.

---

## 🚀 Future Improvements

- 🌐 Multi-language support
- 🧭 AI-based route optimization
- 📈 Enhanced analytics dashboard
- 🔊 Voice booking assistant

---

## 🧑‍💻 Author

**K.R. Sai Varun**  
[GitHub](https://github.com/KRSaiVarun)

---

## 📄 License

Licensed under the MIT License.
