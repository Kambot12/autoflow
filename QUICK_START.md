# 🚀 AUTOFLOW PRO - QUICK START CHEATSHEET

## 🌐 LIVE NOW
**http://localhost:3001**

---

## 🔓 LOGIN CREDENTIALS

### User Login
- **URL**: http://localhost:3001/auth/signup
- **Email**: Any email (auto-creates account)
- **Method**: Click "Sign up with Google"

### Admin Login
- **URL**: http://localhost:3001/auth/login → Admin tab
- **Email**: `admin@autoflow.com` (ONLY THIS)
- **OTP**: Check browser console (F12) after requesting
- **Copy OTP** from 📧 EMAIL SENT message

---

## 📱 KEY LINKS

| Page | URL | Access |
|------|-----|--------|
| Homepage | `/` | Public |
| User Signup | `/auth/signup` | Public |
| Login | `/auth/login` | Public |
| User Dashboard | `/dashboard/user` | Logged in users |
| Book Service | `/dashboard/user/book-service` | Users |
| My Vehicles | `/dashboard/user/vehicles` | Users |
| My Appointments | `/dashboard/user/appointments` | Users |
| My Repairs | `/dashboard/user/repairs` | Users |
| Admin Dashboard | `/dashboard/admin` | Admin only |
| Bookings Mgmt | `/dashboard/admin/bookings` | Admin only |
| Repairs Mgmt | `/dashboard/admin/repairs` | Admin only |
| Create Repair | `/dashboard/admin/repairs/create` | Admin only |
| Customers | `/dashboard/admin/customers` | Admin only |

---

## 🎯 QUICK WORKFLOWS

### User Workflow (3 minutes)
1. Go to **`/auth/signup`**
2. Click "Sign up with Google"
3. Enter any email
4. ✅ **In dashboard** → Click "Book Service"
5. Select service, add vehicle, pick date
6. ✅ **Appointment created**

### Admin Workflow (3 minutes)
1. Go to **`/auth/login`**
2. Click **"Admin"** tab
3. Enter: `admin@autoflow.com`
4. Click "Send OTP"
5. Open **DevTools** (F12) → Console tab
6. Find **📧 EMAIL SENT** message with OTP
7. Copy the 6-digit number
8. Paste in form → Click "Verify OTP"
9. ✅ **In admin dashboard**
10. Create repair, manage bookings, etc.

---

## 🔐 OTP TROUBLESHOOTING

**Q: Where is the OTP?**
- A: It's NOT in a popup. Check **browser console (F12)**

**Q: I don't see the OTP?**
- A: Look for a message that starts with **📧 EMAIL SENT**

**Q: Did I enter the email wrong?**
- A: Must be EXACTLY: `admin@autoflow.com`

**Q: OTP expired?**
- A: Valid for 10 minutes. Request a new one.

---

## 💾 DATA STORAGE

Everything is stored in **browser localStorage**:
- User data
- Appointments
- Repairs
- Vehicles
- Messages
- Receipts

⚠️ **Clearing browser data = lose everything**
✅ **Use private browser window to test fresh**

---

## 🎨 FEATURES AT A GLANCE

### User Side ✨
- Book services
- Manage vehicles
- Track appointments & repairs
- View repair costs
- Download receipts
- Chat with admin

### Admin Side 👑
- Approve/reject bookings
- Create repair jobs
- Update repair status
- Set costs (labour + parts)
- View all customers
- Auto-generate receipts

---

## 🛠️ TECH STACK

- **Framework**: Next.js 14
- **UI**: React 18 + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Storage**: localStorage
- **Backend**: Next.js API Routes

---

## 📊 TEST DATA

### Car Makes (Dropdown)
Toyota • Honda • Lexus • Mercedes • BMW • Ford • Hyundai • Kia • Nissan • Peugeot

### Service Types (Dropdown)
- Engine Repair
- Oil Change
- Brake Service
- Transmission Repair
- AC Repair
- Electrical Diagnostics
- Tire Replacement
- General Servicing

---

## ⚡ COMMON TASKS

### How to create an appointment?
1. Login as user
2. Click "Book Service"
3. Fill form → Submit

### How to update appointment status?
1. Login as admin
2. Go to "Bookings"
3. Click "Edit" on any booking
4. Change status → Save

### How to create a repair?
1. Login as admin
2. Go to "Repairs"
3. Click "Create Repair"
4. Fill form → Submit

### How to view customer details?
1. Login as admin
2. Go to "Customers"
3. Click any customer card

### How to generate a receipt?
1. Create a repair
2. Set status to "Completed"
3. ✅ Receipt auto-generates
4. User can download

---

## 🐛 DEBUGGING

### Open Developer Tools
- **Mac**: Cmd + Option + I
- **Windows/Linux**: Ctrl + Shift + I

### Check Console for Emails
1. Open DevTools
2. Click "Console" tab
3. Look for 📧 messages
4. Copy OTP from message

### View localStorage Data
1. Open DevTools
2. Click "Application" tab
3. Click "localStorage"
4. Find "http://localhost:3001"
5. View all stored data

---

## 🚀 DEPLOYMENT

### Ready to Deploy?
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. ✅ Deployed!

---

## 📞 SUPPORT DOCS

- **Full setup guide**: See `README.md`
- **React vs Next.js**: See `REACT_VS_NEXTJS.md`
- **Complete overview**: See `SETUP_COMPLETE.md`

---

## ✅ WHAT'S WORKING

- ✅ User authentication (Google OAuth simulated)
- ✅ Admin OTP login
- ✅ Book services
- ✅ Manage vehicles
- ✅ Track appointments
- ✅ Manage repairs
- ✅ View customers
- ✅ Generate receipts
- ✅ Real-time updates
- ✅ Email simulation
- ✅ Responsive design
- ✅ Dark/red theme

---

## 🎯 NEXT LEVEL

To make this production-ready:
1. Add real database (PostgreSQL)
2. Setup real Google OAuth
3. Connect email service (SendGrid)
4. Add payment processing (Stripe)
5. Deploy to Vercel
6. Setup custom domain

---

## 🏁 YOU'RE ALL SET!

Your app is ready to use. Start at:
### **http://localhost:3001**

Have fun! 🚀

---

**Questions? Check the README or docs folder!**
**Built with ❤️ using Next.js 14**
