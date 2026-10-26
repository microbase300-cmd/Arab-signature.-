# Arab Signature Hotel & Suites — Bugs, Root Causes & Fixes Registry

> **MANDATORY AGENT & DEVELOPER RULE**:
> This document is the institutional memory of every bug encountered and resolved in the Arab Signature Hotel & Suites project.
> **Before modifying any file**, review the guardrails below so you never re-introduce a past bug. **Every time a new bug is fixed**, append a new entry (`BUG-XXX`) to this file before committing.

---

## Quick Anti-Regression Checklist (Read Before Every Commit)

1. **Lucide Icon Imports**: Did you verify that every `<Icon />` added in JSX is imported in `import { ... } from 'lucide-react'` at the top of the file?
2. **State Variable Names**: In `ReceptionPortal.jsx`, the logged-in staff state is `currentUser` (NEVER `activeAccount`).
3. **Dual-Workspace Sync**: Did you copy all modified/created files from `c:\Users\ADMIN\OneDrive\Desktop\Arab\web` to `c:\Users\ADMIN\OneDrive\Desktop\arab-signature-web` and run `npm run build` before `git push`?
4. **Counter Reservation Hold Fields**: Does Counter Reservation Hold show `Reservation Date *`, `Expected Check-In *`, `Duration of Stay (Nights) *`, and **optional** compressed `Proof of Payment` image/ref? (Never replace Expected Check-In with Expected Check-Out on Hold).
5. **No Bulk Room Reset Buttons on Front Desk**: Never re-add "Make Main (20 Rooms) Available" or "Make Extension Available" buttons to `ReceptionPortal.jsx`.
6. **Public vs. Staff Navigation**: Never expose Admin, Reception, or Accountant login links on the public guest Navbar or Footer.

---

## Chronological Bug & Fix Log

### `BUG-001` — Blank Screen in Reception Portal When Switching Tabs (Unimported Icons / Undefined State)
- **Date**: 2026-10-24 & 2026-10-26
- **Commits**: `f8eafa9`, `4e59ff3`
- **Affected File**: `src/pages/ReceptionPortal.jsx`
- **Symptom**:
  1. Clicking the **Intercom Chat** tab caused the Reception Portal to render a blank screen (`ReferenceError: ArrowRight is not defined`).
  2. Clicking the **Food & Drinks (`dining_orders`)** tab caused the Reception Portal to go completely blank (`ReferenceError: BellRing is not defined`, `Eye is not defined`, and `activeAccount is not defined`).
- **Root Cause**: JSX templates referenced Lucide icons (`ArrowRight`, `BellRing`, `Eye`) that were missing from the top-level `lucide-react` import list, and referenced `activeAccount` instead of `currentUser`.
- **Fix Applied**: Imported `ArrowRight`, `BellRing`, and `Eye` from `lucide-react` and replaced `activeAccount` with `currentUser`.
- **Permanent Guardrail**: Always check the `lucide-react` import block at line 1–12 whenever adding or editing JSX icons, and run `npm run build` to verify symbol resolution.

---

### `BUG-002` — Counter Reservation Hold Displayed "Expected Check-Out" Instead of "Expected Check-In"
- **Date**: 2026-10-26
- **Commit**: `ab425cf`
- **Affected Files**: `src/pages/ReceptionPortal.jsx`, `src/data/portalStore.js`, `src/components/GuestSessionPassModal.jsx`, `src/pages/CustomerDashboardPage.jsx`
- **Symptom**: Under "Counter Reservation Hold", the form showed `Reservation Date`, `Held Duration`, and `Expected Check-Out`, missing `Expected Check-In`.
- **Root Cause**: When a client books a Counter Reservation Hold, they reserve at the counter and leave ("reserve and go out"), returning on a future date to check in. Showing Expected Check-Out instead of Expected Check-In did not capture when the guest will arrive.
- **Fix Applied**:
  - Replaced `Expected Check-Out` input with an editable **`Expected Check-In *`** date picker (`walkInForm.expectedCheckIn`).
  - Retained **`Reservation Date *`** and **`Duration of Stay (Nights) *`**.
  - Auto-calculated vacate/check-out date as `expectedCheckIn + nights` (`handleExpectedCheckInChange` and `handleNightsChange`).
  - Persisted `expectedCheckIn` across `portalStore.js`, Front Desk Ledger, Printable Folio Receipt, Guest Pass, and Customer Dashboard.
- **Permanent Guardrail**: Counter Reservation Hold must always display `Reservation Date *`, `Expected Check-In *`, and `Duration of Stay (Nights) *`.

---

### `BUG-003` — Proof of Payment Was Compulsory Text-Only Instead of Optional Compressed Image on Server
- **Date**: 2026-10-26
- **Commit**: `ee6c3b7`
- **Affected Files**: `src/utils/imageCompressor.js`, `api/proof-of-payment.js`, `src/components/ProofOfPaymentModal.jsx`, `src/pages/ReceptionPortal.jsx`, `src/pages/AccountantPortal.jsx`, `src/pages/AdminPortal.jsx`, `src/data/portalStore.js`
- **Symptom**: Proof of payment was a `required` text input, preventing receptionists from uploading a photo of the POS slip/bank transfer receipt or proceeding without a reference when not applicable.
- **Root Cause**: Lack of client-side image compression utility and serverless image persistence endpoint.
- **Fix Applied**:
  - Removed `required` from Proof of Payment in both counter booking modes.
  - Created `src/utils/imageCompressor.js` to compress camera/gallery photos (3–10 MB) into ~50–90 KB JPEGs (95%+ size reduction) using HTML5 Canvas.
  - Created Vercel serverless function `api/proof-of-payment.js` backed by MantleDB cloud storage.
  - Created `src/components/ProofOfPaymentModal.jsx` so Admin, Accountant, and Receptionist can inspect full-screen payment slips, download them, and stamp audits / confirm payments directly.
- **Permanent Guardrail**: Proof of payment must remain optional (`required={false}`), support image uploads compressed via `compressImage()`, and be inspectable in Admin and Accountant portals.

---

### `BUG-004` — Dangerous Bulk "Make Rooms Available" Reset Button Exposed in Reception Portal
- **Date**: 2026-10-26
- **Commit**: `a67b05f`
- **Affected File**: `src/pages/ReceptionPortal.jsx`
- **Symptom**: A toolbar button (`Make Main (20 Rooms) Available` / `Make Extension (14 Rooms) Available`) allowed receptionists to reset an entire building's occupancy with one click.
- **Root Cause**: Developer testing utility button left visible in production front-desk UI.
- **Fix Applied**: Removed the bulk "Make Available" button from both Main Building and Extension Building views in `ReceptionPortal.jsx`.
- **Permanent Guardrail**: Never place bulk inventory reset buttons in the Reception Portal.

---

### `BUG-005` — Missing Order Code Verification Input for Walk-In / Pickup Food & Drink Orders at Main Reception
- **Date**: 2026-10-26
- **Commits**: `00e8d37`, `2cfad15`, `f8f7e6a`
- **Affected Files**: `src/pages/ReceptionPortal.jsx`, `src/pages/DiningPage.jsx`, `src/pages/OrderTrackingPage.jsx`
- **Symptom**:
  1. Food checkout showed "Pay on Counter POS" instead of online payment / lodge room bill, and showed a premature "ARB-FDD Code Ready" badge.
  2. When customers arrived at Main Reception to pick up `ARB-FDD-*` or `ARB-DRK-*` orders, the receptionist had no input box to type the customer's order code and verify/confirm handover.
- **Root Cause**: Missing dedicated Order Code Lookup & Verification bar in `ReceptionPortal.jsx`.
- **Fix Applied**:
  - Removed "Pay on Counter POS" and premature code badge from `DiningPage.jsx`; added a clear choice between **Outside/Walk-In Order (Pay Online)** and **Lodge Guest (Add to Room Bill)**.
  - Added a prominent **Order Code Lookup & Handover Verification Terminal** at the top of Main Building Reception (`ReceptionPortal.jsx`) where staff type `ARB-FDD-XXXX` or `ARB-DRK-XXXX` to inspect items and click **Confirm Pickup / Delivered**.
  - Added dedicated customer `OrderTrackingPage.jsx`.
- **Permanent Guardrail**: All outside-room food/drink orders must route to Main Building Reception and be verifiable by order code.

---

### `BUG-006` — Cross-Building Receptionist Access Bleed & Multi-Tab Session Overwrite
- **Date**: 2026-10-24
- **Commits**: `118c436`, `873fc81`, `664380c`, `7de225d`
- **Affected Files**: `src/pages/ReceptionPortal.jsx`, `src/data/portalStore.js`
- **Symptom**:
  1. Main Building receptionist could modify Extension Wing rooms (101–114) and vice versa.
  2. Logging into Main Reception in Tab A and Extension Reception in Tab B overwrote the active user identity in `localStorage`, causing intercom chat messages to show the wrong sender.
- **Root Cause**: Auth session was stored only in shared `localStorage`, and room action handlers lacked building-boundary guards.
- **Fix Applied**:
  - Stored active staff session in per-tab `sessionStorage` first, falling back to `localStorage`.
  - Enforced `isDeskRoom()` and `isDeskBooking()`: Main Reception (`reception_main`) controls Rooms `601–620` (Main Building) with read-only visibility of Extension; Extension Reception (`reception_ext`) controls Rooms `101–114` (Extension Wing) with read-only visibility of Main.
- **Permanent Guardrail**: Always resolve staff identity via `portalStore.getCurrentUser()` (which prioritizes `sessionStorage`) and enforce `isDeskRoom()` on all room/booking mutations.

---

### `BUG-007` — Checked-Out Booking Codes Still Allowed Active Login & Returning Guests Not Recognized
- **Date**: 2026-10-24
- **Commit**: `a131aed`
- **Affected Files**: `src/data/portalStore.js`, `src/pages/CustomerDashboardPage.jsx`, `src/pages/ReceptionPortal.jsx`
- **Symptom**: After a guest checked out, their old booking code still logged them into an active session instead of showing a "Checked Out" status screen, and when they booked again, the system did not link their past stay history.
- **Root Cause**: `loginCustomer()` did not check for `Checked Out` status, and customer matching did not aggregate stays by normalized phone/email/name.
- **Fix Applied**:
  - Updated `portalStore.loginCustomer()` to detect `Checked Out` / `Completed` bookings and display a dedicated Checked-Out summary screen with settled folio receipt.
  - Added `getCustomerHistoryByBookingCode()` and `findReturningCustomer()` matching by normalized phone/email/name so returning guests receive a fresh booking code while retaining their VIP lifetime history.
- **Permanent Guardrail**: Never reuse old booking codes for new stays; always issue a new `ARS-BGD-*` or `ARS-EXT-*` code and link history via `getCustomerHistoryByBookingCode()`.

---

### `BUG-008` — Stale Browser `localStorage` Preventing Menu & 34-Room Inventory Updates
- **Date**: 2026-10-18 & 2026-10-21
- **Commits**: `e53ac8e`, `a72ffa2`
- **Affected File**: `src/data/portalStore.js`
- **Symptom**: After updating the room count to 34 rooms or expanding the drinks menu to 77 items, existing browsers still displayed the old 5-room or old menu list.
- **Root Cause**: `portalStore.js` read existing unversioned `localStorage` keys before falling back to the updated seed arrays.
- **Fix Applied**: Bumped storage key versions (`ash_portal_rooms_v5_34rooms`, `ash_portal_dining_menu_v6_77drinks`) and added automatic schema migration checks.
- **Permanent Guardrail**: Whenever default seed arrays in `portalStore.js` change, increment the storage key version in `STORAGE_KEYS`.

---

### `BUG-009` — AI Concierge ("Amira") Typing Freeze & Retroactive Mutation of Past Chat Bubbles
- **Date**: 2026-10-18
- **Commits**: `253a0f0`, `f6ac45b`, `eee408f`, `daaa426`
- **Affected Files**: `src/components/AiConcierge.jsx`, `src/utils/hotelAiEngine.js`
- **Symptom**: Rapidly sending messages or triggering room updates while Amira was responding froze the typing indicator, and past chat messages changed their text when rooms were later occupied.
- **Root Cause**: Live event listeners re-evaluated past messages instead of keeping message strings immutable, and `isTyping` lacked a `finally` reset.
- **Fix Applied**: Made chat history messages immutable string snapshots at creation time and wrapped AI response resolution in a `try / finally` block.
- **Permanent Guardrail**: Never mutate rendered chat history objects in place; always use `try / finally` around async UI states.

---

### `BUG-010` — Google Maps Billing / API Key Dependency & Mobile Hero Overlay Obstruction
- **Date**: 2026-10-18 & 2026-10-19
- **Commits**: `ea6261c`, `58a0912`, `b70e2f0`
- **Affected Files**: `src/pages/LocationPage.jsx`, `src/pages/HomePage.jsx`, `src/components/BookingModal.jsx`
- **Symptom**:
  1. Google Maps JavaScript SDK required billing/API keys.
  2. Mobile homepage hero booking bar covered the hotel exterior photography.
  3. Mobile WhatsApp button displayed `(₦0)` when no room was selected.
- **Fix Applied**:
  - Switched `LocationPage.jsx` to a 100% free, zero-API-key Google Maps iframe embed with direct turn-by-turn navigation links.
  - Hidden the floating booking bar on mobile hero screens so the hotel architecture remains unobstructed.
  - Removed `(₦0)` from the WhatsApp button.
- **Permanent Guardrail**: Keep Google Maps 100% free via keyless embed URLs and preserve clean mobile hero visuals.

---

### `BUG-011` — High-Frequency Client Polling Cascading to Vercel Serverless Function Quota
- **Date**: 2026-10-26
- **Affected Files**: `src/components/HotelAiChat.jsx`, `src/data/portalStore.js`
- **Symptom**: `HotelAiChat` mounted on the public landing page executed a 5-second `setInterval` calling `syncRoomsFromCloud()`. If MantleDB experienced high mobile network latency (> 1.5s), it aborted and hit `/api/rooms`, risking 720 serverless function invocations per hour per visitor.
- **Root Cause**: Tight 1500ms cloud timeout and unthrottled 5s polling on public pages with no rate-limiting cooldown on the serverless fallback.
- **Fix Applied**:
  1. Replaced the 5-second polling interval in `HotelAiChat.jsx` with an event-driven architecture (`ash_rooms_updated`, cross-tab `storage`, window `focus`, and on drawer open) and a relaxed 60s background heartbeat.
  2. Increased MantleDB cloud timeout to 4000ms for stable connectivity on Nigerian mobile networks.
  3. Enforced an ironclad 60-second cooldown (`_lastApiRoomsFallbackCall`) in `portalStore.js` so `/api/rooms` can never be called more than once per minute per client session under any circumstance.
- **Permanent Guardrail**: Never run sub-10s polling intervals on public customer-facing components that can cascade to serverless `/api/` endpoints. Always protect serverless fallbacks with a cooldown throttle.
