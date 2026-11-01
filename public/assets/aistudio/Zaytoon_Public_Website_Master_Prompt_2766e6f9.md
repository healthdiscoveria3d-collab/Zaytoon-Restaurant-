# ZAYTOON RESTAURANT --- MASTER PUBLIC WEBSITE DEVELOPMENT BRIEF

## Premium customer-facing website \| Dera Ghazi Khan, Pakistan

**Deliverable:** A complete, polished, production-ready public
restaurant website with a functional customer experience, online
ordering and table reservations.\
**Important scope boundary:** Build the PUBLIC WEBSITE only in this
phase. Do not build, embed, expose, or simulate an Admin Panel in the
public website. The Admin Panel will be generated as a separate
application in a later phase. Build the backend and data model cleanly
so that a separately deployed Admin application can connect to the same
APIs and database later.

------------------------------------------------------------------------

# 1. ROLE AND QUALITY BAR

Act as a senior product designer, brand designer, UX researcher,
full-stack engineer, accessibility specialist, QA engineer and
deployment engineer.

Build a premium digital experience for **Zaytoon Restaurant**, near
Ghazi Ghat Toll Plaza, Dera Ghazi Khan, Pakistan.

This must look and behave like a real, established premium restaurant
brand. It must not look like: - a generic restaurant template; - a
student project; - a basic landing page; - an AI-generated collection of
unrelated sections; - a dashboard disguised as a website; - a static
mockup with dead buttons.

The visual quality must be comparable to a carefully art-directed
hospitality brand website. Prioritize excellent typography, image
selection, composition, spacing, responsive behavior, polished
interactions and consistent visual language.

Do not sacrifice functionality for visuals. Do not sacrifice visual
quality for a generic component library.

Before implementation: 1. Inspect the full requirements. 2. Define the
sitemap, customer journeys, design system, data model and API contracts.
3. Create a concise implementation plan. 4. Then build the complete
working project. 5. Test the finished flows and fix issues before
declaring completion.

Do not stop after creating the homepage.

------------------------------------------------------------------------

# 2. BRAND AND VERIFIED BUSINESS INFORMATION

**Brand name:** Zaytoon Restaurant\
**Location description:** Near Ghazi Ghat Toll Plaza, Dera Ghazi Khan,
Pakistan\
**Currency:** PKR\
**Operating-hours claim supplied by the business brief:** 24/7\
**Phone supplied in earlier research:** +92 302 6777908 --- verify with
the owner before publishing. Store as editable configuration, not
hardcoded content.\
**Website language:** English by default, with architecture that can
support Urdu later.\
**Audience:** Local families, groups, travellers on the N-70 highway and
people searching for a dining stop near Ghazi Ghat.

The client supplied this About section copy. Use it as editable website
content, but make it possible to revise it later:

> Zaytoon Restaurant is one of Dera Ghazi Khan's oldest and largest
> premium culinary landmarks. Elegantly situated directly on the
> picturesque banks of the Sindh (Indus) River near the Ghazi Ghat Toll
> Plaza, it provides a unique waterside fine dining experience.
> Operating round-the-clock (24/7), Zaytoon is celebrated for its
> unmatched food quality, timely service, and absolute staff
> trustworthiness---making it the ultimate dining station for local
> families and N-70 national highway travelers alike.

**Accuracy rule:** Treat business facts and promotional claims as
client-supplied copy, not independently verified facts. Do not invent
awards, certifications, branches, exact river views, facilities,
delivery coverage, opening hours, customer statistics or testimonials.
Keep uncertain claims editable and clearly mark them for owner
confirmation before launch.

**Known menu information currently supplied:** - Category: Cafe &
Desserts - Category: Cold Drinks / Mineral Water Counter - Description
for Cold Drinks / Mineral Water Counter: "Carbonated beverages and
sealed drinking water bottles." - Pricing note for this category:
"Retail MRP"

Do not invent a full menu, dish names, food descriptions, item photos,
prices or discounts. Create a refined menu structure that can be
populated with verified information later. Use clearly labelled
sample/demo content only during development and make it impossible to
mistake demo prices or dishes for confirmed restaurant information.

------------------------------------------------------------------------

# 3. CREATIVE DIRECTION --- PREMIUM HOSPITALITY

Create a distinctive Zaytoon visual identity.

## 3.1 Visual personality

-   Premium, warm, welcoming, confident and elegant.
-   Contemporary Pakistani hospitality, not an artificial "Arabian
    palace" theme.
-   Sophisticated, restrained and timeless.
-   Food and real restaurant photography should be the visual heroes.
-   Use visual storytelling and generous whitespace.
-   Avoid excessive gradients, glowing effects, glassmorphism, random
    gold borders, oversized rounded cards and unnecessary animation.

## 3.2 Suggested design palette

Build a documented design-token system. Suggested starting palette: -
Deep forest green: `#12372D` - Dark evergreen: `#0B241E` - Warm ivory:
`#F7F3EA` - Soft cream: `#EDE5D7` - Muted brass/gold accent: `#B69A62` -
Charcoal text: `#242824` - Muted grey: `#777B75` - White: `#FFFFFF`

These are starting values, not rigid limits. Refine them to create a
cohesive premium identity. Maintain strong contrast and readable text.

## 3.3 Typography

Use a premium, readable pairing, for example: - Elegant editorial serif
for display headings. - Modern sans-serif for body copy, navigation,
buttons and interface labels.

Use licensed/free web fonts with reliable loading and sensible
fallbacks. Avoid too many font families and font weights.

## 3.4 Photography and imagery

-   Use high-quality, relevant restaurant, food, dining and hospitality
    photography.
-   Prefer genuine Zaytoon photography supplied by the client when
    available.
-   Do not imply stock images are actual photographs of Zaytoon.
-   If temporary stock imagery is used, keep it replaceable and document
    the exact files/locations.
-   Use consistent image grading and aspect ratios.
-   Optimize images to WebP/AVIF where appropriate.
-   Provide descriptive alt text.
-   Never stretch, distort or pixelate images.
-   Do not use random unrelated food images as if they represent actual
    menu items.

## 3.5 Motion and interaction

Use subtle, intentional animation: - Smooth section reveals. - Gentle
image transitions. - Refined hover states. - Menu/category
transitions. - Cart feedback. - Reservation confirmation feedback. -
Respect `prefers-reduced-motion`. Avoid scroll hijacking, excessive
parallax, distracting floating elements and animation that harms
performance.

------------------------------------------------------------------------

# 4. PUBLIC WEBSITE SITEMAP

Build these customer-facing routes:

1.  `/` --- Home
2.  `/about` --- About Zaytoon
3.  `/menu` --- Full menu
4.  `/menu/:categorySlug` --- Menu category
5.  `/deals` --- Special deals and promotions
6.  `/deals/:dealSlug` --- Deal details
7.  `/order` --- Cart / order entry
8.  `/checkout` --- Checkout
9.  `/order/confirmation/:orderReference` --- Order confirmation
10. `/track-order` --- Order tracking
11. `/reservation` --- Book a table
12. `/reservation/confirmation/:reference` --- Reservation confirmation
13. `/gallery` --- Restaurant and food gallery
14. `/contact` --- Contact and directions
15. `/privacy-policy` --- Privacy policy
16. `/terms` --- Terms and conditions

Create a consistent header, footer, responsive navigation and branded
404 page.

Do not create public routes for employee management, payroll, banking
details, internal reports or admin operations.

------------------------------------------------------------------------

# 5. HOMEPAGE --- ART-DIRECTED CUSTOMER EXPERIENCE

The homepage is the most important brand touchpoint. It must feel
premium immediately.

## 5.1 Header

-   Elegant logo/wordmark.
-   Navigation: Home, About, Menu, Special Deals, Gallery, Contact.
-   Prominent "Book a Table" action.
-   Prominent "Order Online" action.
-   Mobile navigation drawer with accessible controls.
-   Sticky header behavior only if it improves usability.
-   Header must remain visually clean on small screens.

## 5.2 Hero section

Create a visually striking, editorial hero: - Large premium
restaurant/food image or carefully composed image/video. - Zaytoon
wordmark. - Short, memorable headline. - One concise supporting
sentence. - Primary CTA: Explore Menu. - Secondary CTA: Book a Table. -
Optional third CTA: Order Online. - Carefully designed contrast overlay
if required. - Responsive composition: do not crop important subjects on
mobile.

Do not invent a slogan as an official brand statement. Propose a
tasteful temporary line that can be edited.

## 5.3 Intro / brand story

-   Short introduction.
-   Link to full About page.
-   Strong image and text composition.
-   Use the client-provided About copy as the source content.

## 5.4 Signature menu preview

-   Show only verified menu items once provided.
-   Category tabs or horizontal category navigation.
-   Food photography, dish name, concise description and confirmed
    price.
-   "View Full Menu" CTA.
-   Do not show fabricated prices or fake bestseller labels.

## 5.5 Special deals preview

-   Feature active promotions only.
-   Premium offer cards with date/validity information.
-   Clear terms and conditions.
-   "View All Deals" CTA.
-   If no verified active promotions exist, show a tasteful configurable
    promotional section or hide it. Never invent a live discount.

## 5.6 Dining experience / gallery preview

-   Editorial image grid.
-   Real restaurant images when available.
-   Link to gallery.
-   Do not claim facilities that have not been confirmed.

## 5.7 Reservation CTA

-   Strong, elegant booking section.
-   "Plan Your Visit" or equivalent editable heading.
-   Book a Table CTA.
-   Brief explanation of the reservation request process.

## 5.8 Location / visit section

-   Ghazi Ghat Toll Plaza area, Dera Ghazi Khan.
-   Map embed or map link using verified coordinates/address.
-   Phone and WhatsApp contact only after owner confirmation.
-   Directions CTA.
-   Do not invent map coordinates.

## 5.9 Footer

Include: - Logo and short brand description. - Navigation links. - Menu
and deals links. - Contact information. - Address and directions. -
Social media links only when verified. - Editable business hours. -
Privacy and terms links. - The mandatory legal disclaimer below.

**Mandatory footer legal line --- use exactly:**

> Disclaimer: Menu item prices are indexed against local market rates
> for livestock and seasonal items, and are subject to operational
> modifications. Please confirm final rates directly with our billing
> agent when placing an order or reservation.

Make the disclaimer readable on mobile. Do not hide it in a tiny font.

------------------------------------------------------------------------

# 6. MENU EXPERIENCE

Create a high-quality, customer-friendly digital menu.

## 6.1 Menu functionality

-   Category navigation.
-   Search by item name.
-   Filter by category.
-   Optional dietary/allergen labels only when verified.
-   Item detail view or modal.
-   Food image.
-   Item name.
-   Description.
-   Price in PKR.
-   Availability status.
-   Add to cart.
-   Quantity selection.
-   Special item instructions where supported.

## 6.2 Menu data

Menu items and categories must come from the backend/database, not be
scattered as hardcoded JSX.

Support: - Categories. - Subcategories. - Items. - Item images. -
Descriptions. - Price. - Availability. - Featured flag. - Display
order. - Optional variants/add-ons. - Optional preparation notes. -
Optional allergen information. - Active/inactive state.

The future separate Admin application must be able to create, update,
reorder, publish and unpublish menu data through documented APIs.

## 6.3 Price accuracy

-   Currency: PKR.
-   Format amounts consistently.
-   Do not create fictional menu prices.
-   Support a configurable "Retail MRP" price note for applicable sealed
    beverages.
-   Make price notes visible where relevant.
-   If price is unavailable, display a clear "Price to be confirmed"
    state only if the restaurant approves that wording; otherwise do not
    publish the item as orderable.

------------------------------------------------------------------------

# 7. ONLINE ORDERING --- REAL CUSTOMER FLOW

Build a functional ordering flow, not a decorative cart.

## 7.1 Cart

-   Add/remove items.
-   Increase/decrease quantity.
-   Item-level instructions.
-   Cart persistence across refreshes where appropriate.
-   Clear cart.
-   Accurate subtotal.
-   Fees and delivery charges only when configured.
-   Final total.
-   Availability validation before checkout.

## 7.2 Fulfilment methods

Prepare support for: - Restaurant pickup. - Home delivery.

Delivery must only be enabled after the restaurant confirms service
areas, delivery fees, minimum order and operating rules. Do not invent
delivery coverage.

## 7.3 Checkout fields

-   Customer full name.
-   Mobile phone.
-   Email optional.
-   Fulfilment method.
-   Delivery address and area if delivery is enabled.
-   Pickup timing if applicable.
-   Customer instructions.
-   Order summary.
-   Payment method.

## 7.4 Payment

Initial safe payment option: - Cash at restaurant / cash on delivery,
according to the selected fulfilment method and owner policy.

Architect for a future payment gateway integration, but do not claim
payment is completed unless a real gateway verifies it. Do not collect
or store card details directly.

## 7.5 Order lifecycle

Support: - Pending - Confirmed - Preparing - Ready - Out for Delivery -
Completed - Cancelled

Only display status updates actually received from the backend. Explain
that an order is a request until the restaurant confirms it.

## 7.6 Order confirmation

-   Unique human-readable order reference.
-   Order details.
-   Customer details summary.
-   Fulfilment details.
-   Payment method and payment status.
-   Clear next steps.
-   Contact option.

## 7.7 Order tracking

Allow customers to track an order using a secure reference plus a
verification step, such as matching phone number or one-time code. Do
not expose other customers' orders through guessable IDs.

------------------------------------------------------------------------

# 8. TABLE RESERVATION SYSTEM

Build a real reservation request experience.

Customer fields: - Full name. - Mobile number. - Email optional. -
Date. - Preferred time. - Number of guests. - Seating preference, if the
restaurant confirms seating options. - Special request.

Features: - Date/time validation. - Configurable guest limits. -
Configurable reservation time slots. - Availability checks. - Prevent
overlapping table bookings. - Reservation reference. - Confirmation
page. - Cancellation/contact instructions. - Clear status: request
received, confirmed, declined or cancelled.

Important: - A submitted request must not be described as confirmed
unless the backend/restaurant confirms it. - Table capacity and
available slots must be configurable. - Use database
transactions/constraints to prevent double booking. - Do not promise
specific seating features until confirmed by the restaurant.

------------------------------------------------------------------------

# 9. DEALS, EVENTS AND PROMOTIONS

Create a dedicated public **Special Deals** experience. The future Admin
Panel will manage the deals; the public website only displays published
offers.

Support promotion types such as: - Today's Special. - Weekend Deals. -
Family Deals. - Couple Deals. - Eid Special. - Ramadan / Iftar / Sehri
offers. - Independence Day promotions. - Seasonal offers. - Event-based
promotions. - Custom campaigns.

Each deal may contain: - Title. - Slug. - Short description. - Full
description. - Promotional banner/image. - Included menu items. -
Original price, if verified. - Offer price, if verified. - Discount
percentage, if mathematically valid. - Promo code. - Start date/time. -
End date/time. - Terms and conditions. - Usage limit, if applicable. -
Active/scheduled/expired state. - Featured-on-homepage setting. -
Display order.

Public behavior: - Only published and currently valid deals are
displayed as active. - Scheduled offers must not appear early as
active. - Expired deals must not be orderable. - Countdown only when a
real expiry time is configured. - Coupon and deal rules must be
validated by the backend during checkout. - Do not stack discounts
unless explicitly configured. - Do not fabricate "limited time",
crossed-out prices or discount percentages.

The public Deals page should be visually excellent and feel like a
premium campaign page, not a plain list of coupons.

------------------------------------------------------------------------

# 10. GALLERY AND MEDIA

Build: - Masonry/editorial gallery or carefully designed grid. -
Category filters where useful. - Full-screen lightbox. - Keyboard
accessibility. - Responsive image loading. - Alt text. - Optimized
media.

Suggested gallery groupings: - Restaurant. - Food. - Dining. - Events. -
Special moments.

All images must be replaceable without code changes through future Admin
APIs. Use a storage abstraction so production images can later live in
Cloudinary, S3-compatible storage or another persistent object-storage
provider.

Do not rely on Render's ephemeral local filesystem for permanent
uploaded media.

------------------------------------------------------------------------

# 11. CONTACT AND LOCATION

Include: - Address/location description. - Verified phone. - WhatsApp
CTA. - Map embed or directions link. - Contact form. - Configurable
business hours. - Clear contact feedback.

Use placeholders in configuration for unverified data. Do not invent
email addresses, social links, exact coordinates or delivery areas.

Protect the contact form with server-side validation and spam/rate-limit
controls.

------------------------------------------------------------------------

# 12. CUSTOMER EXPERIENCE AND ACCESSIBILITY

-   Mobile-first design.
-   Clear touch targets.
-   Readable typography.
-   Keyboard navigation.
-   Visible focus states.
-   Semantic HTML.
-   Accessible labels.
-   Useful validation messages.
-   Loading, empty, success and error states.
-   Reduced-motion support.
-   High color contrast.
-   Avoid horizontal overflow.
-   No intrusive popups.
-   No forced account registration unless essential.

The customer must be able to browse the menu and understand the
restaurant before being asked to provide personal details.

------------------------------------------------------------------------

# 13. SEO, SOCIAL SHARING AND PERFORMANCE

Implement: - Unique page titles and meta descriptions. - Canonical
URLs. - Open Graph metadata. - Social sharing previews. - Sitemap. -
robots.txt. - Restaurant structured data only using verified facts. -
Local SEO for Dera Ghazi Khan and Ghazi Ghat. - Descriptive image alt
text. - Clean URL slugs. - Optimized assets. - Lazy loading below the
fold. - Code splitting. - Good Core Web Vitals. - Sensible caching. -
Error monitoring hooks.

Do not add fake review schema, fake ratings, fake prices or invented
business details.

------------------------------------------------------------------------

# 14. TECHNICAL ARCHITECTURE

Use a maintainable full-stack architecture.

Preferred stack: - React - Vite - TypeScript - Tailwind CSS - Node.js -
Express - PostgreSQL - Prisma ORM - Zod or equivalent validation - REST
API - Vitest/Jest and Playwright or equivalent tests

Use stable, compatible package versions. Do not use abandoned
dependencies.

## 14.1 Separate public application and future admin application

For this phase: - Generate the public website as its own application. -
Do not generate admin dashboard pages inside it. - Do not add an
`/admin` public route. - Do not add staff or payroll UI. - Do not expose
employee, salary, bank, internal financial or admin endpoints to public
customers.

The future Admin Panel will be a separate application, preferably on a
separate deployment/subdomain such as `admin.example.com`, and will
connect to the same protected backend through authorized APIs.

Keep the public app, future admin app and API logically separate.
Document the integration boundary.

## 14.2 API design

Create versioned API routes, e.g. `/api/v1/...`.

Public read APIs may include: - `GET /api/v1/site-settings/public` -
`GET /api/v1/menu/categories` - `GET /api/v1/menu/items` -
`GET /api/v1/deals/active` - `GET /api/v1/gallery` -
`GET /api/v1/contact` - `POST /api/v1/orders` -
`GET /api/v1/orders/track` - `POST /api/v1/reservations` -
`GET /api/v1/reservations/availability` -
`POST /api/v1/contact-messages`

Protect private operations. Do not expose admin write APIs publicly.

Document request/response schemas, validation, error formats and rate
limits.

## 14.3 Data model

Design database tables/models for: - MenuCategory - MenuItem -
MenuItemVariant - MenuItemImage - Deal - DealMenuItem - PromoCode -
Order - OrderItem - OrderStatusHistory - Payment - Reservation -
RestaurantTable - GalleryImage - RestaurantSettings - ContactMessage -
Customer - AuditLog (for future controlled administrative actions)

The future Admin application will add protected models/modules for: -
User - Role - Permission - Employee - EmployeeBankDetails -
SalaryRecord - SalaryPayment - SalaryDeduction - PayrollAuditLog

Do not expose the future staff/payroll models through public API
responses.

Use: - Foreign keys. - Appropriate indexes. - Unique constraints. -
Timestamps. - Soft deletion where justified. - Database transactions for
order and reservation operations. - Accurate money representation using
integer minor units or suitable Decimal types, never floating-point
arithmetic for financial totals.

------------------------------------------------------------------------

# 15. REQUIRED PROJECT FILES

Generate a complete repository, not a single HTML file or a few
components.

Recommended structure:

``` text
zaytoon-public/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── favicon.svg
│   │   │   └── robots.txt
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   ├── navigation/
│   │   │   │   ├── home/
│   │   │   │   ├── menu/
│   │   │   │   ├── deals/
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   ├── reservation/
│   │   │   │   └── gallery/
│   │   │   ├── pages/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── styles/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── validators/
│       │   ├── utils/
│       │   ├── types/
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/
│       ├── types/
│       └── schemas/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── CONTENT-SETUP.md
│   └── FUTURE-ADMIN-INTEGRATION.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── render.yaml
└── README.md
```

You may improve the structure if necessary, but keep it understandable
and documented.

Required configuration and support files: - Root and app-level package
manifests as appropriate. - Lockfile. - TypeScript configurations. -
Vite configuration. - Tailwind/PostCSS configuration if used by the
selected version. - ESLint configuration. - Prettier configuration. -
Environment example file. - Git ignore rules. - Database schema and
migrations. - Seed script. - API documentation. - Tests. - Render
deployment configuration. - GitHub Actions CI workflow. - README with
exact local setup and production deployment steps.

Do not generate empty placeholder files for features claimed as
complete.

------------------------------------------------------------------------

# 16. CONTENT MANAGEMENT COMPATIBILITY

The future separate Admin Panel must be able to control public website
content without editing source code.

Design the public website to read dynamic data for: - Logo and brand
assets. - Theme tokens and selected visual settings. - Navigation labels
and links. - Homepage section visibility and ordering. - Hero title,
subtitle, image and CTA. - About content and images. - Menu categories,
items and prices. - Deals and promotions. - Gallery images and
ordering. - Contact details. - Address and map link. - Opening hours. -
Social media links. - Footer content and disclaimer. - SEO metadata. -
Announcement bar. - Delivery and pickup configuration.

Provide sensible defaults and graceful fallbacks if optional CMS content
is missing.

Do not let arbitrary admin-supplied HTML or scripts execute on the
public site. Use safe structured content fields and validated
configuration.

Document how a separately built Admin app will authenticate and update
these resources.

------------------------------------------------------------------------

# 17. SECURITY AND PRIVACY

Implement: - Server-side validation for every write operation. - Rate
limiting. - Secure headers. - CORS allowlist. - CSRF protection where
cookie-based authentication is used. - Safe error responses. - SQL
injection protection through ORM/parameterized queries. - XSS-safe
rendering. - Secure secrets management. - Input sanitization where
appropriate. - Secure customer data handling. - Minimal collection of
personal data. - Retention/deletion strategy for customer enquiries and
order data. - No sensitive details in logs.

Do not put secrets in frontend environment variables. Anything bundled
into the browser must be treated as public.

Do not store card data. Do not pretend to execute bank transfers.

------------------------------------------------------------------------

# 18. RENDER AND GITHUB DEPLOYMENT READINESS

The project must be easy to deploy and maintain.

Prepare: - GitHub-ready repository. - Render Blueprint (`render.yaml`)
if compatible with the chosen deployment layout. - Separate Render
service definitions for public frontend and API. - PostgreSQL service
configuration or documented managed database setup. - Environment
variables. - Build and start commands. - Health-check endpoint. -
Database migration release command. - Production CORS configuration. -
Persistent object-storage configuration for images. - SPA route
fallback/rewrite rules where required. - CI workflow for install, lint,
typecheck, tests and builds.

Do not assume local file uploads persist on Render. Use external
persistent object storage for production media.

Document: 1. How to run locally. 2. How to configure PostgreSQL. 3. How
to run migrations. 4. How to seed development data. 5. How to create the
GitHub repository. 6. How to connect services to Render. 7. How to set
environment variables. 8. How to deploy updates. 9. How to roll back a
failed deployment. 10. How to back up and restore the database.

Never commit `.env`, secrets, credentials or production database dumps.

------------------------------------------------------------------------

# 19. TESTING AND ACCEPTANCE CRITERIA

Do not claim completion until these are checked.

## Visual QA

-   Desktop homepage looks polished.
-   Mobile homepage looks intentionally designed, not merely compressed.
-   Header and footer work at all breakpoints.
-   Menu cards and images are consistent.
-   Deals page looks premium.
-   Cart and checkout are clear.
-   Reservation flow is intuitive.
-   Typography, spacing and colors are consistent.
-   No broken images or layout overflow.

## Functional QA

-   All navigation links work.
-   Search and category filters work.
-   Cart quantity and totals are correct.
-   Server validates price and availability.
-   Checkout creates an order.
-   Duplicate submissions are handled safely.
-   Order confirmation displays the correct reference.
-   Tracking does not expose another customer's order.
-   Reservation submission works.
-   Reservation availability prevents conflicts.
-   Deal validity and coupon rules are checked server-side.
-   Expired offers cannot be redeemed.
-   Contact form validates and handles spam controls.
-   All loading, empty, success and error states exist.

## Technical QA

-   Dependencies install cleanly.
-   Lint passes.
-   TypeScript passes.
-   Frontend production build passes.
-   Backend production build passes.
-   Database migrations run.
-   API tests pass.
-   Critical customer-flow tests pass.
-   No secrets are committed.
-   Render configuration is documented and internally consistent.

Use realistic development fixtures only. Clearly identify seed/demo
content. Do not present test data as real restaurant data.

------------------------------------------------------------------------

# 20. FINAL HANDOVER

At completion, provide:

1.  Full source repository.
2.  Complete file tree.
3.  Working public website.
4.  Working backend API.
5.  Database schema and migrations.
6.  Seed data clearly marked as demo.
7.  `.env.example`.
8.  README.
9.  Architecture documentation.
10. API documentation.
11. Render deployment guide.
12. GitHub workflow files.
13. Test results.
14. List of owner-supplied information still needed.
15. Clear instructions for connecting the future separate Admin Panel.

Also provide a short "Owner Setup Checklist" containing: - Confirmed
logo. - Real restaurant photos. - Verified phone and WhatsApp. - Exact
address and map coordinates. - Verified menu and prices. - Confirmed
opening hours. - Delivery areas and fees. - Reservation/table rules. -
Real social media URLs. - Approved deals and terms.

**Final instruction:** Deliver a complete, premium, maintainable public
restaurant website---not a mockup. Keep the Admin Panel separate and do
not build it in this phase. Ensure that the public website is
architected to connect cleanly to a separately generated Admin
application later.
