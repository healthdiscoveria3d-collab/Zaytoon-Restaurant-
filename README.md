# Zaytoon Restaurant — Premium Public Web Application

> **Culinary Landmark on the Banks of the Sindh (Indus) River**  
> Near Ghazi Ghat Toll Plaza, N-70 National Highway, Dera Ghazi Khan, Punjab, Pakistan.

---

## 1. Project Overview & Scope Boundary
This repository contains the complete, production-ready **Public Customer-Facing Website & API** for Zaytoon Restaurant.
- **Scope Boundary**: In strict accordance with the master development brief, this repository delivers the public website only. Administrative, staff, and payroll interfaces are intentionally isolated for Phase 2 (`admin.zaytoonrestaurant.pk`), connecting via protected REST endpoints documented in `docs/FUTURE-ADMIN-INTEGRATION.md`.
- **Operating Hours Claim**: Round-the-clock (24/7) service.
- **Phone**: `+92 302 6777908` (Configured in dynamic settings for pre-launch verification).
- **Currency**: Pakistani Rupee (`PKR`).
- **Livestock Market Indexing Disclaimer**: All mutton/chicken dishes feature market rate indexing disclaimers. Sealed beverages conform to official **Retail MRP**.

---

## 2. Customer Sitemap & Routing
| Route | Description |
|---|---|
| `/` | Editorial Home experience with Indus River hero, heritage story, signatures, deals, and CTAs |
| `/about` | Full historical narrative of Zaytoon on the Indus banks and its 4 hospitality pillars |
| `/menu` | Digital menu with search, category filtering, item customizer modal, and MRP notices |
| `/menu/:categorySlug` | Direct category filtered menu view |
| `/deals` | Special dining packages (Indus Family Feast, N-70 Highway Express Platter, etc.) |
| `/deals/:dealSlug` | Dedicated deal breakdown with included items and 1-click order addition |
| `/order` | Interactive shopping cart with quantity steppers and pickup/delivery toggle |
| `/checkout` | Order details submission, cash payment selection, and kitchen dispatch |
| `/order/confirmation/:orderReference` | Human-readable order confirmation (`ZT-XXXXX`) and next steps |
| `/track-order` | Real-time order progress stepper with phone verification protection |
| `/reservation` | Table & terrace booking form with real-time slot conflict prevention |
| `/reservation/confirmation/:reference` | Table booking registration code (`ZTR-XXXX`) and host arrival instructions |
| `/gallery` | Responsive photo gallery with category filter and full-screen lightbox |
| `/contact` | Directions, Google Maps navigation link, verified telephone, and contact form |
| `/privacy-policy` | Customer data protection, zero credit card storage policy |
| `/terms` | Commercial dining terms and livestock market pricing rules |

---

## 3. Technology Stack
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **API Surface**: REST API v1 (`/api/v1/...`).
- **Database Architecture**: PostgreSQL relational models & Prisma ORM (`docs/DATABASE.md`).
- **Archive Engine**: In-app `JSZip` export for 1-click complete project download (`GET /api/v1/download-project-zip`).

---

## 4. Quick Start (Local Development)
```bash
# 1. Install project dependencies
npm install

# 2. Start the integrated dev server (Express backend + Vite frontend)
npm run dev

# 3. Open in your browser
http://localhost:3000
```

---

## 5. Generating the Complete Project ZIP
To export the complete source code archive:
1. **Via Website UI**: Click the **Download Project ZIP** button in the top announcement bar or footer.
2. **Via Direct URL**: Navigate to `http://localhost:3000/api/v1/download-project-zip`.
3. **Via CLI Script**: Run `npx tsx scripts/generate-zip.ts` to output `zaytoon-restaurant-website-complete.zip`.

---

## 6. Documentation Directory
- `docs/ARCHITECTURE.md`: Full architectural blueprint and security boundaries.
- `docs/API.md`: Detailed REST API v1 request/response contracts.
- `docs/DATABASE.md`: PostgreSQL schema, Prisma definitions, relations, and indexes.
- `docs/DEPLOYMENT.md`: Render deployment blueprint and environment variables.
- `docs/CONTENT-SETUP.md`: Owner setup and launch verification checklist.
- `docs/FUTURE-ADMIN-INTEGRATION.md`: Separation boundary and JWT auth guidelines for the Phase 2 Admin app.
