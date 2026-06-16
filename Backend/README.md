# E-Commerce & Market Intelligence — Backend API

FastAPI backend with JWT authentication, SQLAlchemy ORM, and Supabase (PostgreSQL) database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 |
| Database ORM | SQLAlchemy 2.0 |
| Database | Supabase (PostgreSQL) |
| Auth | JWT via `python-jose` |
| Password Hashing | `passlib[bcrypt]` |
| Validation | Pydantic v2 |
| Server | Uvicorn |

---

## Project Structure

```
Backend/
├── main.py                  # App entry point, CORS, router registration, seed data
├── .env                     # Environment variables (never commit this)
├── requirement.txt          # Python dependencies
├── config/
│   └── database.py          # SQLAlchemy engine, session, ORM models
├── controller/
│   ├── auth.py              # JWT creation, password hashing, guards
│   ├── products.py          # Product CRUD logic + Pydantic schemas
│   ├── cart.py              # Cart add/update/remove/clear logic
│   ├── orders.py            # Order placement and listing logic
│   └── analytics.py        # Market intelligence aggregation queries
└── router/
    ├── auth.py              # POST /api/auth/register|login, GET /api/auth/me
    ├── products.py          # GET|POST /api/products, GET|PUT|DELETE /api/products/{id}
    ├── cart.py              # GET|POST|PUT|DELETE /api/cart
    ├── orders.py            # POST|GET /api/orders, admin order management
    └── analytics.py        # GET /api/analytics/stats|sales|top-products|categories|order-status
```

---

## Setup & Installation

### 1. Create virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirement.txt
```

### 3. Configure environment variables

Create a `.env` file in the `Backend/` directory:

```env
# Supabase PostgreSQL connection string
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres

# JWT settings
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Get your `DATABASE_URL` from **Supabase Dashboard → Project Settings → Database → Connection string (URI)**

### 4. Run the server

```bash
uvicorn main:app --reload
```

Server starts at `http://localhost:8000`

Interactive API docs available at `http://localhost:8000/docs`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL URI | `sqlite:///./ecommerce.db` |
| `SECRET_KEY` | JWT signing secret | `supersecretkey...` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes | `60` |

---

## API Reference

All protected routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login (returns JWT) |
| GET | `/api/auth/me` | ✅ | Get current user profile |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret" }
```

**Login body** (form-data):
```
username=john@example.com&password=secret
```

**Response:**
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "customer" }
}
```

---

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | ❌ | List products (supports `?search=&category=&skip=&limit=`) |
| GET | `/api/products/categories` | ❌ | List distinct categories |
| GET | `/api/products/{id}` | ❌ | Get single product |
| POST | `/api/products` | ✅ Admin | Create product |
| PUT | `/api/products/{id}` | ✅ Admin | Update product |
| DELETE | `/api/products/{id}` | ✅ Admin | Delete product |

---

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | ✅ | Get current user's cart |
| POST | `/api/cart` | ✅ | Add item to cart |
| PUT | `/api/cart/{item_id}` | ✅ | Update item quantity |
| DELETE | `/api/cart/{item_id}` | ✅ | Remove single item |
| DELETE | `/api/cart` | ✅ | Clear entire cart |

**Add to cart body:**
```json
{ "product_id": 1, "quantity": 2 }
```

---

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | ✅ | Checkout (converts cart → order) |
| GET | `/api/orders` | ✅ | Get current user's order history |
| GET | `/api/orders/admin/all` | ✅ Admin | Get all orders |
| PUT | `/api/orders/admin/{id}/status` | ✅ Admin | Update order status |

**Order statuses:** `pending` · `shipped` · `delivered` · `cancelled`

---

### Analytics (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/stats` | Total revenue, orders, customers, products |
| GET | `/api/analytics/sales?days=30` | Daily revenue over N days |
| GET | `/api/analytics/top-products?limit=5` | Top selling products by units |
| GET | `/api/analytics/categories` | Revenue breakdown by category |
| GET | `/api/analytics/order-status` | Order count by status |

---

## Database Models

```
User          → id, name, email, hashed_password, role, created_at
Product       → id, name, description, price, category, image_url, stock, rating, reviews_count
CartItem      → id, user_id (FK), product_id (FK), quantity
Order         → id, user_id (FK), status, total, created_at
OrderItem     → id, order_id (FK), product_id (FK), quantity, price
```

---

## Default Seed Data

On first startup the server seeds:

- **Admin user:** `admin@shop.com` / `admin123`
- **8 sample products** across Electronics, Sports, Home, and Fashion categories

---

## CORS

Allowed origins (configurable in `main.py`):
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
