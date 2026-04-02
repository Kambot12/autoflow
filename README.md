# 🚗 AutoFlow Pro - Complete Car Service Platform

A **production-ready** mechanic service, fleet management, and vehicle marketplace platform built with **Next.js 14**.

## 🎯 Quick Start

```bash
npm install --legacy-peer-deps
npm run dev
```

Visit **http://localhost:3000**

---

## 🔐 AUTHENTICATION

### User Login (Google OAuth)
- **Email**: Any email for testing
- **Auto**: Creates account on first login
- **Route**: `/auth/signup` or `/auth/login`

### Admin Login (OTP Verification) ⚠️
- **Email**: `admin@autoflow.com` (ONLY)
- **Step 1**: Request OTP → sent to console (email simulation)
- **Step 2**: Enter 6-digit OTP from console
- **Route**: `/auth/login` (Admin tab)

> ⚠️ **OTP is NOT shown in popups/toasts** — check browser console for simulated email

---

## 📱 USER SIDE FEATURES

### Dashboard `/dashboard/user`
- 📊 Today's appointment status
- 🔧 Current repair progress  
- 💬 Unread messages counter
- 💰 Total spending
- 🚀 Quick action buttons

### Book Service `/dashboard/user/book-service`
- Select service type (dropdown)
- Describe issue
- Choose existing car or add new vehicle
- Pick date & time
- Auto-creates appointment

### My Appointments `/dashboard/user/appointments`
- View all bookings
- Track status: Pending → Confirmed → In Progress → Completed
- Cancel (if Pending)

### My Repairs `/dashboard/user/repairs`
- Read-only repair log
- Cost breakdown (labour + parts)
- Admin notes visible
- Download receipt (when completed)

### My Vehicles `/dashboard/user/vehicles`
- Add cars (make, model, year, plate, color)
- View service history
- Track maintenance alerts
- Fleet management

---

## 👑 ADMIN SIDE FEATURES

### Admin Dashboard `/dashboard/admin`
- 📊 Real-time stats
  - Pending bookings
  - Active repairs
  - Total customers
  - Weekly revenue
- Quick links to all management sections

### Bookings Management `/dashboard/admin/bookings`
- View all user bookings
- Change status: Pending → Confirmed → In Progress → Completed → Cancelled
- Assign dates and add notes
- Table view with inline editing

### Repairs Management `/dashboard/admin/repairs`
- Create new repair jobs
- Update status
- Set costs (labour + parts)
- Add images and notes
- Auto-generate receipts on completion

### Create Repair `/dashboard/admin/repairs/create`
- Title
- Description
- Labour & parts costs
- Admin notes

### Customers `/dashboard/admin/customers`
- View all users
- Booking history count
- Repair history count
- Quick view customer details

---

## 🛠️ TECHNOLOGY STACK

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Animation**: Framer Motion
- **State**: localStorage + Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Backend**: Next.js API Routes (simulated)
- **Data**: localStorage (no database needed yet)

---

## 📊 DATA STORAGE

All data is stored in **localStorage** (browser):
- `user` — current logged-in user
- `sessionToken` — auth token
- `appointments` — all bookings
- `repairs` — all repair jobs
- `vehicles` — user car fleet
- `messages` — chat messages
- `emails` — simulated email logs
- `listings` — marketplace items
- `receipts` — generated receipts

---

## 🚀 DEMO DATA

### Car Makes
Toyota, Honda, Lexus, Mercedes-Benz, BMW, Ford, Hyundai, Kia, Nissan, Peugeot

### Service Types
- Engine Repair
- Oil Change
- Brake Service
- Transmission Repair
- AC Repair
- Electrical Diagnostics
- Tire Replacement
- General Servicing

---

## 📧 EMAIL SIMULATION SYSTEM

Emails are **NOT shown in UI/popups/toasts** for security.

**Check browser console** to see simulated emails:
```
📧 EMAIL SENT (Admin only sees in console): {
  to: "admin@autoflow.com",
  subject: "Your AutoFlow Admin Login OTP",
  body: "Your OTP is: 123456. Valid for 10 minutes."
}
```

### Email Types
- ✅ Admin OTP (login)
- ✅ Repair updates (user notifications)
- ✅ Appointment confirmations
- ✅ Receipts (auto-generated on repair completion)

---

## 🔄 REAL-TIME SYSTEM

### Implemented Features
- ✅ Chat-style messaging between user & admin
- ✅ Instant notifications on repair updates
- ✅ Real-time status sync across pages
- ✅ Auto-refresh appointments
- ✅ Receipt generation on repair completion

**Data Sync**: Using localStorage triggers + Context API

---

## 🏪 MARKETPLACE

### Features (Setup Ready)
- User listings approval system
- Admin-only listings
- Car marketplace with images
- Vehicle specification tracking
- Faults documentation
- "Contact Seller" messaging system

---

## 🎨 UI FEATURES

- ✨ Clean, modern design (Tailwind CSS)
- 🎭 Smooth animations (Framer Motion)
- 📱 Fully responsive (mobile/tablet/desktop)
- 🌓 Light mode (default)
- ⚡ Fast load times
- 🎯 Intuitive navigation

---

## 🔐 SECURITY IMPLEMENTATION

- ✅ OTP NOT displayed in UI/toasts
- ✅ Admin email whitelisting (only `admin@autoflow.com`)
- ✅ Session tokens in localStorage
- ✅ Protected admin routes
- ✅ User-specific data isolation

---

## 📝 API ENDPOINTS (Next.js Routes)

### Authentication
- `POST /api/auth/google` — Google OAuth
- `POST /api/auth/admin` — Admin OTP system

### Data Management
- `POST /api/repair` — Repair operations

---

## 🎯 NEXT STEPS (PRODUCTION)

1. **Replace localStorage** with real database (PostgreSQL/MongoDB)
2. **Setup Google OAuth** with actual credentials
3. **Email service** (SendGrid/Nodemailer)
4. **Real WebSocket** for live messaging
5. **Payment integration** (Stripe/Paystack)
6. **File uploads** (S3/Cloudinary)
7. **User authentication** with JWT
8. **Admin roles & permissions**

---

## 📞 TESTING CREDENTIALS

### User Account
- Use any Google email for testing
- Account auto-creates on first login

### Admin Account
- 📧 Email: `admin@autoflow.com`
- 🔐 OTP: Check browser console after requesting OTP

---

## 🐛 TROUBLESHOOTING

**Problem**: OTP not showing
- ✅ Check browser console (F12) → look for 📧 EMAIL SENT message

**Problem**: Admin login not working
- ✅ Verify email is `admin@autoflow.com` exactly
- ✅ OTP must be 6 digits
- ✅ OTP expires after 10 minutes

**Problem**: Data not persisting
- ✅ Check localStorage is enabled
- ✅ Not using private/incognito browser mode

---

## 📦 BUILD & DEPLOY

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
npm run build
git push  # Vercel auto-deploys from Git
```

---

## 📄 LICENSE

Project created for AutoFlow Pro — All rights reserved

---

**Built with ❤️ using Next.js 14**
# autoflow-pro
