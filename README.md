# 🏨 Arab Signature Hotel & Suites — Luxury Official Website

> **Digital Platform & Software Architecture: Built by [Microbase](https://kinggold-one.vercel.app)**

A high-end, responsive multi-page website and direct suite booking system for **Arab Signature Hotel and Suites**, located in **Nsugbe, Onitsha, Anambra State, Nigeria**.

Engineered and **Built by [Microbase](https://kinggold-one.vercel.app)** using **React**, **Vite**, **Tailwind CSS**, and **Lucide React**.

---

## ✨ Features

- **Royal Velvet & Champagne Gold Luxury Theme**: Design 1 palatial aesthetic with smooth micro-interactions.
- **Cinematic Welcome Intro**: Dynamic self-writing typewriter sequence with staggered gold dissipation ("*The Only Verified Signature in Nsugbe*").
- **Multi-Page Dedicated Navigation**:
  - `Home`: Full cinematic hero, horizontal suite search engine, poolside oasis preview, and hotel manifesto.
  - `About Us`: Verbatim establishment manifesto, private investment group heritage, and 4 core hospitality pillars.
  - `Doha Suites`: Catalog of 4 suite categories (*Deluxe Doha ₦45k, Executive Arabian ₦65k, Royal Penthouse ₦120k, Standard Classic ₦35k*) with filter pills and specs.
  - `Poolside & Cabanas`: Curtained VIP poolside cabanas, daybeds, Moroccan spa, and diplomatic boardroom.
  - `Al-Sultan Dining`: Authentic Arabian feasts (*Lamb Mandi, Beirut Mezze, Shawarma*) and Nigerian delicacies (*Catfish Point & Kill, Oha soup*).
  - `Location & Contact`: Nsugbe Onitsha address, 24/7 reception hotline, instant WhatsApp concierge, and direct booking inquiry form.
- **Integrated Booking System**:
  - Instant booking engine supporting dates, guest details, and room selection.
  - Verified Paystack payment simulation.
  - Instant **1-Click WhatsApp Concierge Dispatch** that formats and sends the reservation code, guest name, room, dates, and amount directly to the front desk reception phone (`0812 578 6875`).
- **Official Option 1 Brand Identity**: Modern architectural "AS" monogram badge with website theme colors.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production deployment
npm run build
```

---

## 📤 Deploying to GitHub & Vercel / Cloudflare Pages

### Step 1: Push this folder to your GitHub

1. Create a new repository on your GitHub account (e.g. `arab-signature-hotel-website`).
2. Open terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Arab Signature Hotel official website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/arab-signature-hotel-website.git
git push -u origin main
```

---

### Step 2: Deploy Free on Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New Project"** &rarr; Select your `arab-signature-hotel-website` repository.
3. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your luxury hotel website will be live worldwide in under 60 seconds!

---

### Step 3: Connect Your Custom Domain (e.g. `arabsignaturehotel.com`)

1. In your Vercel project dashboard, go to **Settings &rarr; Domains**.
2. Type your custom domain (e.g. `arabsignaturehotel.com`).
3. Add the two DNS records shown by Vercel into your domain registrar (Namecheap, GoDaddy, Whogohost, etc.):
   - `A` Record: `@` &rarr; `76.76.21.21`
   - `CNAME` Record: `www` &rarr; `cname.vercel-dns.com`
4. Vercel automatically generates free SSL security certificates (HTTPS).

---

## 📞 Hotel Information Config

All hotel data, room rates, and phone numbers are managed in:
[`src/data/hotelData.js`](src/data/hotelData.js)

- **Hotline Phone**: `0812 578 6875`
- **WhatsApp Concierge**: `2348125786875`
- **Location**: `Nsugbe, Onitsha, Anambra State, Nigeria`

---

## 💻 Development & Engineering Credits

- **Platform Architecture & Development:** **Built by [Microbase](https://kinggold-one.vercel.app)**
- **Developer Website:** [https://kinggold-one.vercel.app](https://kinggold-one.vercel.app)
- **Technology Stack:** React, Vite, Tailwind CSS, Local/Cloud Portal Synchronization
- **Security & Portals:** Dual-Role Cryptographic Hash Protection (General Manager Admin & Front Desk Receptionist)
- **Client:** Arab Signature Hotel and Suites, Nsugbe, Onitsha
- **Copyright:** © 2026 Arab Signature Hotel and Suites. All rights reserved. Built by [Microbase](https://kinggold-one.vercel.app).
