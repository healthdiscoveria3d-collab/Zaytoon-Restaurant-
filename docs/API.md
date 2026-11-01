# Zaytoon Restaurant — REST API Specification (v1)

Base URL: `/api/v1`

## 1. Public Read Endpoints

### `GET /site-settings/public`
Returns verified restaurant contact numbers, location descriptions, 24/7 operating hours, and legal disclaimers.

### `GET /menu/categories`
Returns active menu categories with item counts and display ordering.

### `GET /menu/items`
Query parameters:
- `category` (optional slug or category ID)
- `search` (optional string query)
- `featured` (optional boolean)
Returns array of validated menu items, prices in PKR, and MRP/livestock pricing notes.

### `GET /deals/active`
Returns currently active family, highway express, and late-night deals with promo codes and breakdown of included dishes.

### `GET /gallery`
Returns curated restaurant photography categorised by riverside, culinary, ambiance, and family moments.

### `GET /reservations/availability?date=YYYY-MM-DD`
Returns available dining slots and table vacancy count (enforcing maximum capacity to prevent double booking).

---

## 2. Customer Transactional Endpoints

### `POST /orders`
Creates a customer dining or delivery order.
**Request Body:**
```json
{
  "customerName": "Sharjeel Khan",
  "customerPhone": "+923001234567",
  "customerEmail": "user@example.com",
  "fulfilmentMethod": "pickup",
  "deliveryAddress": "Optional street address",
  "deliveryArea": "Ghazi Ghat / DG Khan",
  "pickupTime": "25 minutes",
  "instructions": "Extra green chilies please",
  "items": [
    {
      "itemId": "item-mutton-karahi",
      "quantity": 1,
      "specialInstructions": "Mild black pepper"
    }
  ],
  "paymentMethod": "cash_at_counter"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order received successfully...",
  "data": {
    "reference": "ZT-54812",
    "total": 2850,
    "status": "pending"
  }
}
```

### `GET /orders/track?reference=ZT-54812&phone=+923001234567`
Returns order timeline (`pending` -> `confirmed` -> `preparing` -> `ready` -> `completed`). Requires matching phone digits for privacy protection.

### `POST /reservations`
Submits a table booking request with automatic conflict detection.
**Request Body:**
```json
{
  "fullName": "Sharjeel Khan",
  "phone": "+923026777908",
  "date": "2026-11-05",
  "timeSlot": "20:30",
  "guests": 6,
  "seatingPreference": "outdoor_riverside",
  "specialRequest": "River bank corner"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "reference": "ZTR-9821",
    "status": "received"
  }
}
```

### `POST /contact-messages`
Submits a guest inquiry with rate-limiting and validation.

### `GET /download-project-zip`
Packages the entire repository into a complete `.zip` archive on demand and streams it with `Content-Disposition: attachment`.
