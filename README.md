# 🧺 LaundryPro — Mini Laundry Order Management System

A lightweight dry-cleaning order management system with a Node.js/Express backend (SQLite), JWT authentication, and a single-page HTML frontend.

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18

### Run locally

```bash
cd backend
npm install
npm start
```

Open **http://localhost:3000** in your browser.

> The frontend is served statically by the same Express server — no separate build step needed.

### Environment Variables (optional)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `JWT_SECRET` | `laundry_super_secret_key_2024` | JWT signing secret |

---

## Features Implemented

| Feature | Status |
|---|---|
| User registration & login (JWT) | ✅ |
| Create order (customer, phone, garments, qty) | ✅ |
| Auto-calculated total bill | ✅ |
| Unique Order ID (ORD-XXXXXXXX) | ✅ |
| Estimated delivery date (+3 days) | ✅ |
| Order status: RECEIVED → PROCESSING → READY → DELIVERED | ✅ |
| Update order status | ✅ |
| List all orders | ✅ |
| Filter by status, customer name, phone | ✅ |
| Search by garment type | ✅ |
| Dashboard: total orders, revenue, orders per status | ✅ |
| Simple frontend (single-page HTML/CSS/JS) | ✅ |
| SQLite persistent storage | ✅ |
| Configurable garment price list | ✅ |

---

## API Reference

All `/api/orders` and `/api/dashboard` routes require `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ username, password }` |
| POST | `/api/auth/login` | `{ username, password }` |

### Orders
| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List orders. Query params: `status`, `name`, `phone`, `garment` |
| GET | `/api/orders/:id` | Get single order |
| PATCH | `/api/orders/:id/status` | Body: `{ status }` |
| GET | `/api/orders/prices` | Returns garment price list |

### Dashboard
| Method | Endpoint |
|---|---|
| GET | `/api/dashboard` |

---

## AI Usage Report

### Tools Used
- **Amazon Q Developer** (primary) — scaffolding, route logic, frontend UI
- **GitHub Copilot** — inline completions during editing

### Sample Prompts Used
1. *"Build a Node.js Express backend with SQLite for a laundry order management system. Include JWT auth, order CRUD, status updates, and a dashboard endpoint."*
2. *"Create a single-page HTML frontend with login, order creation with live bill preview, order list with filters, and status update modal. No frameworks."*
3. *"Add garment-type search to the orders list endpoint — garments are stored as a JSON string in SQLite."*
4. *"Write a dashboard route that returns total orders, total revenue, and a breakdown of orders per status."*

### What AI Got Right
- Boilerplate Express setup, middleware wiring, JWT auth flow
- SQLite schema and prepared statements
- Frontend layout structure and CSS grid/flexbox
- API fetch helper and localStorage token management

### What I Had to Fix / Improve
- AI initially used `res.status(200).json()` for 201 Created responses — corrected to proper HTTP status codes
- The garment search was initially done in SQL with `LIKE` on the JSON column, which was fragile — moved to post-query JS filter for correctness
- AI generated a separate frontend dev server setup; simplified to serve static files directly from Express
- Frontend modal initially lacked the current status pre-selection — added `currentStatus` parameter to `openModal()`
- AI used `app.use(express.static(...))` after route definitions, causing the fallback `*` route to never serve the HTML — reordered middleware

---

## Tradeoffs & What I'd Improve

### Skipped (intentional)
- No input sanitization beyond basic validation (acceptable for internal tool)
- No pagination on orders list
- No role-based access (single user type)
- No unit tests

### Would improve with more time
- Add pagination + sorting to orders list
- Move JWT secret to `.env` with `dotenv`
- Add order deletion / soft-delete
- Deploy to Railway or Render with a persistent volume for SQLite
- Add print/invoice view per order
- Replace SQLite with PostgreSQL for multi-instance deployments
