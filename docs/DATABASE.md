# Zaytoon Restaurant — Relational Database Specification

Designed for **PostgreSQL 15+** with **Prisma ORM**.

## 1. Prisma Schema Definition (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  OUT_FOR_DELIVERY
  COMPLETED
  CANCELLED
}

enum FulfilmentMethod {
  PICKUP
  DELIVERY
}

enum PaymentMethod {
  CASH_AT_COUNTER
  CASH_ON_DELIVERY
}

enum PaymentStatus {
  PENDING
  PAID_ON_FULFILMENT
  REFUNDED
}

enum ReservationStatus {
  RECEIVED
  CONFIRMED
  DECLINED
  CANCELLED
}

enum SeatingPreference {
  OUTDOOR_RIVERSIDE
  INDOOR_FAMILY_HALL
  EXECUTIVE_LOUNGE
  ANY
}

model SiteSetting {
  id              String   @id @default(cuid())
  brandName       String   @default("Zaytoon Restaurant")
  tagline         String
  locationName    String
  address         String
  highwayRef      String
  phone           String
  whatsapp        String
  email           String
  operatingHours  String   @default("24/7")
  currency        String   @default("PKR")
  verifiedNotice  String
  legalDisclaimer String
  aboutHistory    String   @db.Text
  updatedAt       DateTime @updatedAt
}

model MenuCategory {
  id           String     @id @default(cuid())
  name         String     @unique
  slug         String     @unique
  description  String
  displayOrder Int        @default(0)
  isActive     Boolean    @default(true)
  items        MenuItem[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([slug])
}

model MenuItem {
  id              String       @id @default(cuid())
  categoryId      String
  category        MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name            String
  slug            String       @unique
  description     String       @db.Text
  price           Int          // Represented in whole PKR units
  priceNote       String?      // e.g. "Retail MRP" or "Indexed livestock rate"
  image           String
  isAvailable     Boolean      @default(true)
  isFeatured      Boolean      @default(false)
  isDemoItem      Boolean      @default(false)
  preparationTime String?
  spiciness       String?
  tags            String[]
  orderItems      OrderItem[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([categoryId])
  @@index([slug])
}

model Deal {
  id                 String   @id @default(cuid())
  title              String
  slug               String   @unique
  shortDescription   String
  fullDescription    String   @db.Text
  image              String
  originalPrice      Int
  offerPrice         Int
  discountPercentage Int
  promoCode          String?  @unique
  includedItems      String[]
  serves             String
  validUntil         DateTime
  isFeatured         Boolean  @default(false)
  isActive           Boolean  @default(true)
  terms              String[]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([slug])
  @@index([isActive])
}

model Order {
  id               String           @id @default(cuid())
  reference        String           @unique // e.g. "ZT-54812"
  customerName     String
  customerPhone    String
  customerEmail    String?
  fulfilmentMethod FulfilmentMethod @default(PICKUP)
  deliveryAddress  String?
  deliveryArea     String?
  pickupTime       String?
  instructions     String?          @db.Text
  subtotal         Int
  deliveryFee      Int              @default(0)
  total            Int
  status           OrderStatus      @default(PENDING)
  paymentMethod    PaymentMethod    @default(CASH_AT_COUNTER)
  paymentStatus    PaymentStatus    @default(PENDING)
  items            OrderItem[]
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  @@index([reference])
  @@index([customerPhone])
  @@index([status])
}

model OrderItem {
  id                  String   @id @default(cuid())
  orderId             String
  order               Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  itemId              String
  item                MenuItem @relation(fields: [itemId], references: [id])
  itemName            String
  quantity            Int
  unitPrice           Int
  subtotal            Int
  specialInstructions String?
  createdAt           DateTime @default(now())

  @@index([orderId])
  @@index([itemId])
}

model Reservation {
  id                String            @id @default(cuid())
  reference         String            @unique // e.g. "ZTR-9821"
  fullName          String
  phone             String
  email             String?
  date              String            // ISO date string YYYY-MM-DD
  timeSlot          String            // e.g. "20:30"
  guests            Int
  seatingPreference SeatingPreference @default(ANY)
  specialRequest    String?           @db.Text
  status            ReservationStatus @default(RECEIVED)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([date, timeSlot])
  @@index([reference])
  @@index([phone])
}

model GalleryImage {
  id        String   @id @default(cuid())
  title     String
  category  String
  image     String
  caption   String
  createdAt DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  fullName  String
  phone     String
  email     String?
  subject   String
  message   String   @db.Text
  createdAt DateTime @default(now())
}
```

## 2. Integrity and Concurrency
- `reference` columns are indexed and unique to guarantee collision-free lookup.
- Reservations query slot capacity with row-locking in PostgreSQL (`SELECT ... FOR UPDATE`) before accepting new booking instances.
