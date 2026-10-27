# Arab Signature Hotel & Suites — Complete Commit & Development Changelog

This document records the complete history of every single commit, feature, bug fix, and architectural update coded for **Arab Signature Hotel & Suites (Nsugbe, Onitsha, Anambra State)** from project inception (`9934d5c`) to the latest production release (`ee6c3b7`).

---

## Summary Statistics
- **Total Commits Logged**: 97 Commits
- **Repository**: `https://github.com/microbase300-cmd/Arab-signature.-.git` (`main` branch)
- **Active Portals**: Public Website, VIP Guest Portal (`CustomerDashboardPage`), Main & Extension Reception Portals (`ReceptionPortal`), Accountant Portal (`AccountantPortal`), Executive Admin Portal (`AdminPortal`), and Food/Drink Order Tracker (`OrderTrackingPage`).

---

## Phase 9: Counter Reservation Holds, Proof of Payment Server Sync, WhatsApp Receipt Dispatch, Food/Drink Order Hub & Accountant Portal (2026-10-26)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `HEAD` | 2026-10-27 | `feat` | **CEO Portal Default Operations, Products & Order Queue Command Center**: Made `overview` (**Hotel Operations & Products Summary**) the default tab when the CEO logs into `AdminPortal.jsx` instead of the Suite Rate Manager. Upgraded top KPI cards to show **Rooms Booked & Active** (`Occupied + Reserved` split across Main 600 Wing & Extension 100 Wing), **Drinks & Food Sold** (`ARB-DRK` units/orders + `ARB-FDD` plates/orders), **Pending Orders Queue**, and **Total Hotel Revenue** (Suites + Bar + Kitchen). Added 4 Operations Pillars, a live filterable **Bar & Kitchen Order Queue** with 1-click CEO fulfillment (`Mark Ready`, `Mark Delivered`, `Confirm Paid`), a live **34-Suite Status Map**, and a **3-Column Full Hotel Products & Catalog Performance** overview. |
| `a184668` | 2026-10-27 | `feat` | **Remove Login OTP & Configure Official Domain Staff Accounts**: Removed 2-step email OTP from Accountant and CEO login flows (`AccountantLoginPage.jsx`, `AdminLoginPage.jsx`) for instant direct sign-in while keeping customer booking/food email confirmations active on `arabsignature.com`; configured official staff accounts (`main@arabsignature.com`, `extension@arabsignature.com`, `accountant@arabsignature.com`, and CEO personal email). |
| `4982fb4` | 2026-10-27 | `feat` | **Resend Transactional Email Integration (`arabsignature.com`)**: Added `api/send-email.js` and `src/utils/emailService.js` with Arabian luxury HTML email templates for suite reservation confirmations (`ARS-BGD` / `ARS-EXT`) and food/drink order confirmations (`ARB-FDD` / `ARB-DRK`). |
| `e92eebe` | 2026-10-27 | `feat` | **Remove Accountant Expenses & Add Advanced Calculation Spreadsheet**: Removed the Operational Expenses tab from `AccountantPortal.jsx` and replaced it with a full interactive **Advanced Financial Spreadsheet** featuring live auto-synced hotel revenue rows (`ARS-BGD`, `ARS-EXT`, `ARB-FDD`, `ARB-DRK`), custom calculation rows, editable `Qty`/`Unit Rate`/`Adjustment` cells, live cumulative running balance, multi-row checkbox selection statistics (`SUM`, `AVG`, `MIN`, `MAX`, `COUNT`), an `fx` math expression evaluator bar (`+`, `-`, `*`, `/`, `%`), interactive VAT/Tax & Discount % modeling, date/stream/channel filters, and full Excel CSV export. |
| `8aa5428` | 2026-10-27 | `feat` | **Obfuscated Staff Slugs, 2-Step Accountant Security PIN & Exclusive Admin Credential Management**: Decommissioned predictable portal URLs (`/#reception`, `/#accountant`, `/#admin`) with a dedicated security gate screen; implemented secret slugs (`#desk-600m-gate`, `#desk-100e-gate`, `#vault-finance-77a`, `#exec-core-99x`); added 2-Step verification for Accountant Portal (Username + Password + 6-digit Financial Security PIN with 5-attempt lockout); and centralized all staff credential management exclusively in `AdminPortal.jsx` with 1-click "Copy Secret Link" actions (`BUG-013`). |
| `5ea9c26` | 2026-10-27 | `feat` | **Voice AI Gated Behind Feature Flag**: Turned off Voice AI features for lean first launch via `ENABLE_VOICE_ASSISTANT = false` in `HotelAiChat.jsx`. Restored clean, focused text chat interface while keeping `clientVoiceAssistant.js` modularly preserved for instant re-activation whenever needed. |
| `a619f25` | 2026-10-26 | `feat` | **100% Client-Side Voice AI Assistant ("Amira")**: Built `clientVoiceAssistant.js` using browser Web Speech API (`SpeechRecognition` for voice input, `SpeechSynthesis` for speech output) with **zero serverless function calls and zero cloud audio API costs**. Added golden microphone input with live interim transcript, audio wave visualizer, natural concierge female voice narration, 1-click Mute/Unmute toggle, message-level "Listen" buttons, and audio feedback protection (`BUG-012`). |
| `eb7e95e` | 2026-10-26 | `perf` | **Serverless Quota Protection & Anti-Polling Guardrail**: Eliminated 5-second public landing page polling loop in `HotelAiChat.jsx` in favor of event-driven updates (`ash_rooms_updated`, `storage`, `focus`), extended MantleDB cloud timeout to 4000ms for Nigerian cellular networks, and enforced an ironclad 60-second cooldown protection on `/api/rooms` fallback in `portalStore.js` (`BUG-011`). |
| `986c607` | 2026-10-26 | `docs` | **Foundational Project Governance & Architecture Suite**: Created `BUGS_AND_FIXES.md`, `CHANGELOG.md`, `IMPLEMENTATION_PLAN.md`, `PROJECT_ARCHITECTURE.md`, and `ROADMAP.md` synchronized across all development and repository roots. |
| `ee6c3b7` | 2026-10-26 | `feat` | **Optional Compressed Proof of Payment Image Upload + Generate Receipt & WhatsApp Dispatch**: Added client-side image compression (`src/utils/imageCompressor.js` shrinking 3–10MB photos to ~50–90KB JPEGs), made proof of payment optional (`required={false}`), created Vercel serverless endpoint `api/proof-of-payment.js` backed by MantleDB, created `ProofOfPaymentModal.jsx` for Admin/Accountant/Reception slip inspection, added prominent **Generate Receipt** button in Bookings Ledger, and added 1-click **Send to WhatsApp** receipt dispatch using the customer's phone number. |
| `ab425cf` | 2026-10-26 | `feat` | **Expected Check-In & Duration of Stay on Counter Reservation Hold**: Replaced read-only Expected Check-Out under Counter Reservation Hold with editable **Expected Check-In \*** date picker and **Duration of Stay (Nights) \***, auto-computing vacate date (`expectedCheckIn + nights`) and syncing across Guest Pass, Ledger, and Folios. |
| `e77c377` | 2026-10-26 | `feat` | **Client Home Address, Next of Kin & Dual Counter Booking Modes**: Added Client Home Address and Next of Kin (Full Name, Phone, Relationship) to both Web (`BookingModal.jsx`) and Counter (`ReceptionPortal.jsx`) bookings; introduced two counter modes (**Assign & Check In Now** vs **Counter Reservation Hold**) with Reservation Date and Proof of Payment fields. |
| `a67b05f` | 2026-10-26 | `fix` | **Remove Bulk "Make Available" Buttons**: Removed `Make Main (20 Rooms) Available` and `Make Extension (14 Rooms) Available` bulk reset buttons from both Main and Extension building views in `ReceptionPortal.jsx`. |
| `f8f7e6a` | 2026-10-26 | `feat` | **Receptionist Order Code Verification Terminal**: Added dedicated customer order code input & verification terminal (`ARB-FDD-XXXX` / `ARB-DRK-XXXX`) in `ReceptionPortal.jsx` for instant order lookup and pickup/delivery confirmation. |
| `4e59ff3` | 2026-10-26 | `fix` | **Reception Dining Tab Blank Screen Fix**: Imported missing `BellRing` and `Eye` icons from `lucide-react` and replaced `activeAccount` with `currentUser` in the `dining_orders` tab of `ReceptionPortal.jsx`. |
| `2cfad15` | 2026-10-26 | `feat` | **Main Reception Pickup Notification Hub & Order Tracking Page**: Added real-time Main Reception pickup notifications & dispatch hub for non-room dining orders, plus dedicated customer `OrderTrackingPage.jsx` to track food/drink order status by code. |
| `00e8d37` | 2026-10-26 | `feat` | **Food Checkout Refinement & Main Reception / Accountant Routing**: Removed premature `ARB-FDD Code Ready` tag, removed `Pay on Counter POS` for food checkout, added clear explainer between standalone food order vs. in-lodge room bill charging, and routed all outside-room orders to Main Building Reception and Accountant Portal. |
| `ae6895c` | 2026-10-26 | `feat` | **Website Food & Drink Booking (`ARB-FDD` / `ARB-DRK`), In-Lodge Bill Linking, Counter Code Generator & Accountant Portal**: Implemented online food (`ARB-FDD-<random>`) and drink (`ARB-DRK-<random>`) ordering, automatic room folio linking for checked-in lodge guests, front-desk counter booking code generator, and full `AccountantPortal.jsx` (`AccountantLoginPage.jsx`). |

---

## Phase 8: VIP Guest Portal, Arabian Luxury Welcome Experience, Building-Aware Booking Codes & Dual-Wing Reception Intercom (2026-10-24)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `895536a` | 2026-10-24 | `feat` | **Arabian Luxury Guest Welcome Page**: Redesigned guest welcome dashboard (`CustomerDashboardPage.jsx`) with authentic Arabian hospitality aesthetic, interactive digital suite keycard, cultural heritage showcase, and concierge quick actions. |
| `a131aed` | 2026-10-24 | `feat` | **Guest Portal Logout, Checked-Out Status Screen & Returning Guest Memory**: Added logout button, dedicated Checked-Out status screen when logging in with a past stay's booking code, and returning customer memory (`getCustomerHistoryByBookingCode`) that links lifetime stays while issuing a new code per reservation. |
| `71602e2` | 2026-10-24 | `feat` | **Alphanumeric Suffix on Booking Codes**: Added 2 random uppercase letters to the end of building-aware booking codes (`ARS-BGD-1234AB`, `ARS-EXT-5678XY`). |
| `7741b61` | 2026-10-24 | `feat` | **Building-Aware Booking Codes (`ARS-BGD` & `ARS-EXT`)**: Implemented collision-free building-specific booking codes (`ARS-BGD-*` for Main Building 600 Wing, `ARS-EXT-*` for Extension 100 Wing). |
| `80564fd` | 2026-10-24 | `feat` | **Cinematic VIP Welcome Intro**: Redesigned customer dashboard with cinematic VIP welcome intro and clean Guest Portal navbar button. |
| `c794b9d` | 2026-10-24 | `feat` | **Dedicated Full-Page Customer Dashboard**: Restored original Book A Suite button and upgraded customer portal from modal to dedicated full dashboard page (`CustomerDashboardPage.jsx`). |
| `862097c` | 2026-10-24 | `feat` | **Customer Portal Login & Settled Bill Access**: Added booking code login, settled bill folio access, and returning customer history tracking. |
| `97f5dd9` | 2026-10-24 | `style` | **High-Contrast Gold Buttons**: Styled ultra high-contrast luminous gold continue and proceed buttons in `BookingModal.jsx`. |
| `e58dec3` | 2026-10-24 | `feat` | **Pre-Payment Guest Form & VIP Session Pass**: Added pre-payment guest info form with Paystack checkout and `GuestSessionPassModal.jsx`. |
| `7de225d` | 2026-10-24 | `fix` | **Live Intercom Heartbeat & Session Fix**: Ensured instant live intercom rendering with 1500ms heartbeat, fresh session resolution, and extended network timeout. |
| `664380c` | 2026-10-24 | `feat` | **Cross-Tab Intercom Broadcast & Per-Tab Session Isolation**: Enabled `BroadcastChannel` cross-tab sync, cloud sync heartbeat, and `sessionStorage` per-tab session isolation for intercom chat. |
| `f8eafa9` | 2026-10-24 | `fix` | **Intercom Chat Icon Import Fix**: Resolved blank screen when opening intercom chat by importing missing `ArrowRight` icon in `ReceptionPortal.jsx`. |
| `821481d` | 2026-10-24 | `feat` | **Dual-Wing Intercom Chat & Retention Policy**: Disabled auto-fill on reception login and implemented dual-wing intercom chat with 7-day front desk retention and 30-day admin audit retention. |
| `873fc81` | 2026-10-24 | `fix` | **Strict Main Building Operational Boundary**: Enforced strict Main Building operational boundary for reception login with view-only Extension visibility. |
| `118c436` | 2026-10-24 | `feat` | **Dual Receptionist Portals (Main vs. Extension)**: Implemented dual receptionist accounts (`reception_main` for Main Building Rooms 601–620, `reception_ext` for Extension Wing Rooms 101–114) with cross-building read-only overview. |
| `819e0ad` | 2026-10-24 | `feat` | **Google Search Console Verification**: Added Google Search Console HTML verification file (`google138efb4a3086db1a.html`) and meta tag. |
| `04af724` | 2026-10-24 | `feat` | **Whitley Neill Gin Bottle Photo**: Updated Whitley Neill Gin image to authentic Lemongrass & Ginger bottle photo. |
| `c30c16b` | 2026-10-24 | `feat` | **Drinks Catalog Visual Refinements**: Updated V-Smartic to carton image, Pure Heaven to can, Soursop to can, Bullet to Black Bullet, and added Whitley Neill Gin at ₦50,000. |

---

## Phase 7: Paystack Live/Test Gateway Integration & Real-Time Receptionist Chime Alerts (2026-10-23)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `05b77e5` | 2026-10-23 | `feat` | **Real-Time Receptionist Alert Chime & Auto-Room Assignment**: Added synthesized Web Audio receptionist alert chime on new booking, automatic room reservation on Paystack confirmation, and initialized all 34 rooms as available for production. |
| `866941b` | 2026-10-23 | `feat` | **Paystack Default Staging Public Key**: Configured default test public key for immediate Paystack staging checkout. |
| `ab815b5` | 2026-10-23 | `feat` | **Paystack Checkout Gateway & Verification API**: Integrated `src/utils/paystack.js` inline checkout gateway with staging/production key switch in Admin Portal and serverless `api/verify-payment.js`. |

---

## Phase 6: 34-Room Dual-Building Architecture, Arab Suites Rebranding & Luxury Promo Popups (2026-10-22)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `c452110` | 2026-10-22 | `feat` | **Randomized Promo Selection**: Randomized initial promo popup selection while preserving 1 suite, 2 kitchen, 2 drinks ratio. |
| `65aeaaf` | 2026-10-22 | `fix` | **Promo Popup Timer & Refresh Tracking**: Ensured reliable refresh counter tracking and 5-second appearance timer for `LuxuryPromoPopup.jsx`. |
| `954d925` | 2026-10-22 | `feat` | **Promo Frequency Adjustment (3-in-5)**: Updated promo popup cadence to trigger 3 times in every 5 page refreshes. |
| `f0e5884` | 2026-10-22 | `feat` | **Promo Distribution Ratio**: Configured refresh frequency and 5-show distribution (1 suite, 2 kitchen, 2 drinks). |
| `d142b4c` | 2026-10-22 | `feat` | **Luxury Promo Popups (`LuxuryPromoPopup.jsx`)**: Added non-intrusive luxury promo popups for chef food combos, bar drinks, and Arab Suites weekend events. |
| `aac74f7` | 2026-10-22 | `feat` | **2-Level Building & Category Suite Filters**: Arranged Arab Suites list with 2-level building (`Main Building` / `Extension Wing`) and room category filters in a 3-column layout. |
| `49edebb` | 2026-10-22 | `feat` | **Arab Suites Rebranding**: Replaced "Doha Suites" with "Arab Suites" across navigation, homepage, footer, gallery, and AI concierge. |
| `774893f` | 2026-10-22 | `feat` | **34 Authentic Hotel Rooms Configuration**: Configured all 34 physical rooms across Main Building (20 rooms: `601–620`) and Extension Building (14 rooms: `101–114`) with official board pricing (`₦30k–₦120k`). |
| `fba7374` | 2026-10-22 | `feat` | **Mobile-Optimized About Us Page**: Optimized `AboutPage.jsx` for mobile screens and restructured executive hospitality manifesto. |
| `37cec92` | 2026-10-22 | `feat` | **Chicken & Chips Plating Photo**: Replaced Chicken & Chips photo with authentic roasted chicken and golden fries photography. |

---

## Phase 5: Al-Sultan Fine Dining & 77-Item Bar Catalog Expansion (2026-10-19 to 2026-10-21)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `a72ffa2` | 2026-10-21 | `fix` | **Dining Menu Cache Bump (v4)**: Bumped dining menu storage key to force immediate client cache refresh. |
| `214a165` | 2026-10-21 | `feat` | **14 New Drinks Across 4 Price Tiers**: Added 14 new drinks with isolated bottle packshots and subcategory filters. |
| `0ef0fd5` | 2026-10-21 | `fix` | **Wine Naming & Budweiser Royale Bottle**: Renamed D' Angelus & Roseau wines and updated Budweiser Royale black bottle packshot. |
| `a0035ff` | 2026-10-21 | `feat` | **Food vs. Drinks Primary Menu Split**: Restructured `DiningPage.jsx` into two primary tabs (**Food** and **Drinks**) with rich subcategories. |
| `9970277` | 2026-10-21 | `feat` | **Isolated Bottle Packshots**: Updated drinks menu images to studio-isolated bottle packshots. |
| `ef1cc48` | 2026-10-20 | `feat` | **Curated 63-Drink Baseline**: Restricted drinks catalog to exact hotel bar inventory with authentic bottle images. |
| `aad8834` | 2026-10-20 | `feat` | **Premium Wines, Champagnes, Cognacs, Whiskeys & ₦2,000 Beers**: Added full bar catalog from physical hotel menu boards plus 22 chilled beers at ₦2,000 flat. |
| `abfc0bb` | 2026-10-20 | `feat` | **Dining Navigation & Soup Addon Cleanup**: Updated coleslaw photo, simplified nav title to "Dining", and removed egg addon from soups. |
| `1564d38` | 2026-10-20 | `feat` | **Oha, Nsala & Spaghetti User Photos + Swallows Tab**: Replaced Oha soup, Nsala soup, and Spaghetti photos with user uploads; moved Garri and Semo to dedicated Swallows tab. |
| `eb163e4` | 2026-10-20 | `feat` | **5-Star Culinary Presentation**: Elevated 12 menu item photos to 5-star hotel plating presentation. |
| `ef998cc` | 2026-10-20 | `feat` | **Mandatory Swallow Choice on Soups**: Added Semo or Garri swallow selector on soup dishes and upgraded soup photography. |
| `7c24513` | 2026-10-20 | `feat` | **Multi-Protein Pairing Calculator**: Enabled multi-protein selection and quantity controls on Rice and Soup dishes. |
| `66a5bd9` | 2026-10-20 | `feat` | **25 Authentic Al-Sultan Dishes**: Updated Al-Sultan Dining with 25 authentic dishes, categories, and interactive protein pairing calculator. |
| `3b7658e` | 2026-10-19 | `feat` | **Catalog Mode Cleanup**: Removed legacy in-room buttons during initial catalog phase. |
| `e416734` | 2026-10-19 | `feat` | **Admin Price Control & Reception Price Sheet**: Added Al-Sultan food & drinks pricing catalog with Admin-only price management and Reception read-only price lookup. |

---

## Phase 4: "Amira" AI Concierge, Microbase Attribution, 4K HDR Gallery & Free Google Maps (2026-10-18 to 2026-10-20)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `6f876ec` | 2026-10-20 | `feat` | **Amira AI Concierge & Floating WhatsApp Button**: Renamed AI Concierge to **Amira** across UI and responses, and added floating direct WhatsApp button above the AI widget. |
| `0b7aff5` | 2026-10-20 | `feat` | **Microbase Hyperlink Attribution**: Linked "Built by Microbase" credits to `https://kinggold-one.vercel.app` across footer, portals, AI knowledge base, and README. |
| `dd83589` | 2026-10-20 | `feat` | **Microbase Developer Credits**: Added "Built by Microbase" attribution across footer, portals, metadata, AI knowledge base, and README. |
| `9221d22` | 2026-10-19 | `fix` | **Natural Realistic HDR Gallery Balance**: Updated gallery photos with balanced realistic HDR color grading. |
| `57e5778` | 2026-10-19 | `fix` | **HDR CSS Filter Refinement**: Refined HDR photo mastering and CSS filters for natural texture. |
| `4d14a0a` | 2026-10-19 | `chore` | **Vivid HDR Texture Mastering**: Updated gallery assets with sharp HDR texture mastering. |
| `aba8bf4` | 2026-10-19 | `feat` | **34-Room Architecture Photography**: Replaced room & architecture photos with Vivid HDR photography and updated total rooms to 34. |
| `58a0912` | 2026-10-19 | `refactor` | **100% Free Keyless Google Maps Embed**: Refactored `LocationPage.jsx` to use a 100% free Google Maps iframe embed with zero API key, zero billing, and zero serverless invocations. |
| `93c447c` | 2026-10-19 | `feat` | **Interactive Location Page & Directions**: Integrated Google Maps & live turn-by-turn directions on `LocationPage.jsx`. |
| `4a19409` | 2026-10-19 | `style` | **Homepage Section Headings**: Refined homepage section labels to *5-Star Luxury Accommodations* and *Leisure, VIP Lounge & Fine Dining*. |
| `85861e5` | 2026-10-19 | `style` | **Gallery CTA Button**: Updated CTA button text to *Open Full Photo HD Gallery*. |
| `0a3c2f0` | 2026-10-19 | `style` | **Featured Silent Disco Portrait**: Positioned Silent Disco host portrait among top featured gallery photos. |
| `67c823f` | 2026-10-19 | `feat` | **Ultra-HD 4K Cinematic Photo Gallery & Lightbox**: Added 4K photo gallery with category filters, mobile grid, and fullscreen 4K Lightbox. |
| `ea6261c` | 2026-10-18 | `style` | **Clean Mobile Hero**: Removed floating booking bar from mobile homepage hero so the hotel exterior photo remains 100% unobstructed. |
| `92758b0` | 2026-10-18 | `fix` | **Hero Landscape Photo & Dimming Animation**: Applied exact enhanced landscape hotel exterior photo and restored smooth dimming overlay. |
| `b8f5c7b` | 2026-10-18 | `feat` | **Custom Landscape Hero Exterior**: Replaced hero background with custom landscape hotel exterior image. |

---

## Phase 1–3: Foundation, Cloud Sync (`api/rooms.js` & MantleDB), Staff Portals & AI Concierge Engine (2026-10-17 to 2026-10-18)

| Commit Hash | Date | Type | Detailed Description |
| :--- | :--- | :--- | :--- |
| `79056ad` | 2026-10-18 | `perf` | **Direct Client-to-Cloud Sync**: Queried persistent MantleDB cloud directly from client with zero unnecessary Vercel function invocations. |
| `daaa426` | 2026-10-18 | `fix` | **Immutable AI Chat History**: Made past AI chat messages immutable snapshots and preserved historical room numbers. |
| `3a926f6` | 2026-10-18 | `fix` | **MantleDB Persistent Cloud Store**: Integrated MantleDB persistent cloud store, prevented blind mount overwrite, and added 1.5s timeout. |
| `22bb924` | 2026-10-18 | `feat` | **Serverless `/api/rooms` Sync**: Added Vercel serverless `api/rooms.js` for multi-window, multi-profile, and multi-device real-time sync. |
| `eee408f` | 2026-10-18 | `fix` | **Live AI Concierge Inventory Reader**: Made AI concierge availability queries read live `portalStore` directly. |
| `ea5d924` | 2026-10-18 | `fix` | **Cross-Profile Broadcast Stabilization**: Synced baseline suites across browser profiles and stabilized persistent `BroadcastChannel`. |
| `f6ac45b` | 2026-10-18 | `fix` | **AI Chat Typing Freeze Fix**: Resolved AI chat busy loading freeze with recursion lock and fail-safe `isTyping` reset. |
| `f34634b` | 2026-10-18 | `feat` | **10s AI Brain Auto-Refresh**: Added 10-second client-side AI brain auto-refresh. |
| `e53ac8e` | 2026-10-18 | `fix` | **Storage Schema Migration & Typo Tolerance**: Migrated storage keys to clear legacy browser cache and added typo-tolerant spelling variants (`avalible`, etc.) in AI engine. |
| `253a0f0` | 2026-10-18 | `fix` | **BroadcastChannel Reactivity**: Added real-time room availability sync for AI concierge and `BroadcastChannel` cross-tab reactivity. |
| `82f872e` | 2026-10-17 | `feat` | **Arab Signature AI Concierge Engine**: Added client-side AI Concierge (`src/utils/hotelAiEngine.js`, `src/data/aiKnowledgeBase.js`) with live inventory awareness and booking lookup. |
| `b70e2f0` | 2026-10-17 | `fix` | **Mobile WhatsApp Button Cleanup**: Removed `(₦0)` suffix from Chat on WhatsApp button. |
| `60e52ba` | 2026-10-17 | `chore` | **Vercel SPA Deployment Config**: Added `vercel.json` rewrite rules for instant Vite SPA deployment. |
| `19d2504` | 2026-10-17 | `fix` | **Real-Time Suite Pricing & Paystack Auto-Confirmation**: Synchronized admin rate updates across homepage/guest views and automated Paystack confirmation for reception. |
| `5d03b90` | 2026-10-17 | `feat` | **Role-Separated Logins & Security Monitor**: Separated Admin and Receptionist login portals, removed staff links from public website navbar/footer, and added login security monitor in Admin Portal. |
| `feeee29` | 2026-10-17 | `feat` | **Receptionist & Admin Portals Foundation**: Added password-restricted `ReceptionPortal.jsx` and `AdminPortal.jsx` with live room matrix, walk-in booking, printable guest folio receipts, dynamic suite rates, and activity logs. |
| `9934d5c` | 2026-10-17 | `init` | **Initial Commit**: Created Arab Signature Hotel & Suites luxury multi-page website (`HomePage`, `RoomsPage`, `DiningPage`, `FacilitiesPage`, `LocationPage`, `AboutPage`, `ContactPage`). |
