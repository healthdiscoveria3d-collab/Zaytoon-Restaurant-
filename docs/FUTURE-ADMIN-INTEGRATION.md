# Zaytoon Restaurant — Future Admin Panel Integration

## Architecture Separation
The Public Website is strictly decoupled from administrative operations. When building the standalone Admin Panel in Phase 2:

1. **Subdomain / Host**: Deploy on `admin.zaytoonrestaurant.pk`.
2. **Authentication**: JWT token with Bearer authorization in HTTP headers.
3. **Roles**:
   - `SUPER_ADMIN`: System settings, staff permissions, audit logs.
   - `MANAGER`: Menu pricing adjustments, promotions, reservation management.
   - `CHEF_KITCHEN`: Order status workflow (`preparing`, `ready`).
   - `CASHIER`: Billing confirmations, livestock rate updates.

## Administrative API Endpoints (To be opened in API v1 protected router)
- `PUT /api/v1/admin/menu/items/:id`: Update dish availability, pricing, or livestock notes.
- `PATCH /api/v1/admin/orders/:reference/status`: Advance order state (`pending` -> `confirmed` -> `preparing` -> `ready` -> `completed`).
- `PATCH /api/v1/admin/reservations/:reference/status`: Confirm or decline booking requests.
- `POST /api/v1/admin/deals`: Publish or unpublish promotional packages.
- `PUT /api/v1/admin/site-settings`: Update phone numbers, operating hours, and announcements without code changes.
