from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.database import init_db, SessionLocal, Product, User
from controller.auth import hash_password
from router import auth, products, cart, orders, analytics, users
import os


def seed():
    db = SessionLocal()
    try:
        if db.query(Product).count() > 0:
            return

        # Seed admin user
        if not db.query(User).filter(User.email == "admin@shop.com").first():
            db.add(User(
                name="Admin",
                email="admin@shop.com",
                hashed_password=hash_password("admin123"),
                role="admin"
            ))

        # Seed sample products — prices in INR
        sample_products = [
            Product(name="Wireless Headphones", description="Premium noise-cancelling headphones", price=8349, category="Electronics", image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&auto=format&fit=crop", stock=50, rating=4.5, reviews_count=120),
            Product(name="Running Shoes", description="Lightweight performance running shoes", price=6679, category="Sports", image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop", stock=80, rating=4.3, reviews_count=95),
            Product(name="Smart Watch", description="Feature-packed smartwatch with health tracking", price=16699, category="Electronics", image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop", stock=30, rating=4.7, reviews_count=200),
            Product(name="Coffee Maker", description="Programmable drip coffee maker", price=4174, category="Home", image_url="https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&q=80&auto=format&fit=crop", stock=60, rating=4.2, reviews_count=75),
            Product(name="Yoga Mat", description="Non-slip eco-friendly yoga mat", price=2504, category="Sports", image_url="https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400&q=80&auto=format&fit=crop", stock=100, rating=4.6, reviews_count=150),
            Product(name="Desk Lamp", description="LED adjustable desk lamp", price=2921, category="Home", image_url="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80&auto=format&fit=crop", stock=45, rating=4.4, reviews_count=60),
            Product(name="Backpack", description="Waterproof travel backpack 30L", price=5009, category="Fashion", image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&auto=format&fit=crop", stock=70, rating=4.1, reviews_count=88),
            Product(name="Sunglasses", description="UV400 polarized sunglasses", price=3339, category="Fashion", image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80&auto=format&fit=crop", stock=90, rating=4.0, reviews_count=110),
        ]
        db.add_all(sample_products)
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    seed()
    yield
    # Shutdown – nothing needed


app = FastAPI(title="E-Commerce & Market Intelligence API", lifespan=lifespan)

import os

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# Add production frontend URL from env if set
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.(vercel\.app|netlify\.app|onrender\.com)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(analytics.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "E-Commerce & Market Intelligence API is running"}
