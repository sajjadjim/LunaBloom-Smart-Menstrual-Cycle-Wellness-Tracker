# LunaBloom — Smart Menstrual Cycle & Women's Wellness Tracker 🌸

> **"Your Cycle, Your Comfort, Your Confidence."**

LunaBloom is a modern, privacy-focused, full-stack Next.js web application engineered for menstrual cycle tracking and holistic wellness. It combines statistical cycle calculations with emotional comfort, serene aesthetics, and reliable security.

---

## 🌟 Key Features

1. **Smart Period Tracking & Interactive Calendar:**
   - Color-coded monthly matrix (Dark Pink for confirmed periods, Light Pink for predictions, Lavender for educational fertile windows, Green for daily wellness logs).
   - Flow intensity logging (Spotting, Light, Medium, Heavy) and symptoms recording.
   - Calendar-date-safe storage that avoids UTC timezone shifts.

2. **Statistical Cycle Prediction Engine:**
   - Real-time mathematical cycle calculations based on consecutive confirmed period start dates.
   - Detects cycle variations and irregular cycles, displaying honest confidence levels and estimated ranges rather than false precision.
   - Educational ovulation and fertile window estimation (with clear medical warnings).

3. **Secure Authentication & Sessions:**
   - Firebase Authentication supporting Google Sign-In and Email & Password.
   - Backend verification with Firebase Admin SDK and secure `httpOnly` session cookies.
   - Built-in **Instant Guest Demo** mode allowing immediate exploration with seeded period history.

4. **Automated Period Email Reminders:**
   - Opt-in email notifications sent 2 days before, 3 days before, or both.
   - Powered by Resend API and custom React Email HTML templates.
   - Includes **Discreet Notification Mode** that removes sensitive words from email subjects.
   - Scheduled `/api/cron/period-reminders` endpoint protected by `CRON_SECRET` with idempotency to prevent duplicate sends.

5. **Holistic Wellbeing & Emotional Support:**
   - **Daily Mood Tracker:** 9 animated emoji options with reflective notes and mood-specific comfort ideas.
   - **Period Nutrition Guide ("Nourish Your Body 🌷"):** Iron sources, magnesium, hydration, and culturally diverse comforting meals (including Bangladesh daal, khichuri, and broths).
   - **Period Preparation Kit:** Interactive checklist for pads, spare clothing, heating pads, and personal comforts with progress tracking.
   - **Wellness & Hygiene Guide:** Evidence-based hygiene instructions for pads, tampons, and cups, plus clinical red-flag warnings for when to see a physician.

6. **Cycle History & Analytics:**
   - Powered by Recharts with interactive Cycle Length Trends line chart and Period Duration histogram.
   - Tracks shortest cycle, longest cycle, variation, and most frequently reported symptoms.

7. **Strict Privacy & Data Ownership:**
   - Zero advertising trackers or third-party data selling.
   - 1-click **Export My Data** (JSON archive) in Settings.
   - 1-click **Delete My Account** permanently wiping MongoDB health records and resetting sessions.

8. **Theme & Aesthetics:**
   - Soft pink gradient theme (`#FFF7FB`, `#FCE7F3`, `#F472B6`, `#BE185D`).
   - Elegant dark rose theme with warm velvet night mode.
   - Animated SVG flower illustrations and subtle micro-interactions.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Animations:** Framer Motion, Canvas Confetti
- **Charts:** Recharts
- **Forms & Validation:** React Hook Form, Zod
- **Date Engine:** date-fns (calendar-safe)
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** Firebase Client SDK & Firebase Admin SDK
- **Email:** Resend API
- **Testing:** Vitest, Testing Library, JSDOM

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "LunaBloom — Smart Menstrual Cycle & Wellness Tracker"
npm install --legacy-peer-deps
```

### 2. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`:
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/lunabloom?retryWrites=true&w=majority

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK3VK3po8n15GzS88JaT8ukT-nQuu_YYM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-menstrual-cycle.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-menstrual-cycle
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-menstrual-cycle.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=568890553391
NEXT_PUBLIC_FIREBASE_APP_ID=1:568890553391:web:a26abf480971c3c657c2da

# Firebase Admin SDK (From Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=smart-menstrual-cycle
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@smart-menstrual-cycle.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...-----END PRIVATE KEY-----\n"

# Resend Email API
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM=LunaBloom Reminders <reminders@yourdomain.com>

# Scheduled Cron Secret
CRON_SECRET=lunabloom_secure_cron_secret_key_2026

# App Base URL
APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

Run the test suite verifying prediction calculations, date safety, and validation schemas:
```bash
npm test
```

---

## ⏰ Automated Cron Reminder Job

To trigger the reminder scheduler in production or locally:
```bash
curl -X POST http://localhost:3000/api/cron/period-reminders \
  -H "Authorization: Bearer lunabloom_secure_cron_secret_key_2026"
```
Or configure a Vercel Cron Job in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/period-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. In Project Settings > Environment Variables, add all variables from `.env.local`.
4. Deploy!

---

## 📄 Medical Disclaimer

LunaBloom is an informational and lifestyle tool intended solely to support personal menstrual cycle awareness and wellness habits. It does not provide medical advice, diagnose clinical conditions, or serve as a method of contraception. Always consult a qualified medical professional for health concerns.
