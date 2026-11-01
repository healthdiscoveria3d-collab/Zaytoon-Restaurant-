# Zaytoon Restaurant — System Architecture

## 1. Overview
The Zaytoon Restaurant web platform is a high-performance, customer-facing hospitality application crafted specifically for Zaytoon Restaurant, situated on the banks of the Sindh (Indus) River near Ghazi Ghat Toll Plaza on the N-70 National Highway, Dera Ghazi Khan, Pakistan.

## 2. Separation of Concerns & Security Boundary
- **Public Website (This Application)**:
  - Exclusively serves diners, travelers, and event hosts.
  - Zero admin routes (`/admin` is deliberately absent).
  - No internal employee, payroll, bank, or operational management interfaces.
  - Public read and customer transactional write endpoints (`/api/v1/orders`, `/api/v1/reservations`, `/api/v1/contact-messages`).
- **Future Admin Application (Phase 2)**:
  - Deployed separately (e.g. `admin.zaytoonrestaurant.pk`).
  - Authenticates via JWT and role-based access control (RBAC).
  - Interacts with the shared database schema and private administrative endpoints documented in `docs/FUTURE-ADMIN-INTEGRATION.md`.

## 3. Technology Stack
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend API**: Node.js, Express, TypeScript (`tsx`).
- **Data Layer**: Clean relational schema designed for PostgreSQL + Prisma ORM (with in-memory fallback for container dev).
- **Archival**: Native in-app ZIP compilation (`JSZip`) allowing 1-click full codebase export directly to the user.

## 4. Key Design Principles
- **Editorial Hospitality Aesthetics**: Warm, refined palette (Deep forest green `#12372D`, dark evergreen `#0B241E`, warm ivory `#F7F3EA`, brass `#B69A62`).
- **Zero AI Slop**: No generic pill clusters, no mechanical comment headers (`//`), no fake latency indicators, authentic human copy.
- **Price Integrity**: All livestock and seasonal dishes carry an explicit disclaimer noting market adjustments, with prices verified directly before final billing. Sealed beverages follow authentic "Retail MRP".
