from sqlalchemy.orm import Session
from sqlalchemy import func
from config.database import Order, OrderItem, Product, User
from datetime import datetime, timedelta


def get_dashboard_stats(db: Session):
    total_revenue = db.query(func.sum(Order.total)).filter(Order.status != "cancelled").scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
    }


def get_sales_over_time(db: Session, days: int = 30):
    since = datetime.utcnow() - timedelta(days=days)
    rows = (
        db.query(func.date(Order.created_at).label("date"), func.sum(Order.total).label("revenue"))
        .filter(Order.created_at >= since, Order.status != "cancelled")
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )
    return [{"date": str(r.date), "revenue": round(r.revenue or 0, 2)} for r in rows]


def get_top_products(db: Session, limit: int = 5):
    rows = (
        db.query(Product.name, func.sum(OrderItem.quantity).label("sold"))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )
    return [{"name": r.name, "sold": r.sold} for r in rows]


def get_category_breakdown(db: Session):
    rows = (
        db.query(Product.category, func.sum(OrderItem.quantity * OrderItem.price).label("revenue"))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.category)
        .all()
    )
    return [{"category": r.category or "Uncategorized", "revenue": round(r.revenue or 0, 2)} for r in rows]


def get_order_status_breakdown(db: Session):
    rows = (
        db.query(Order.status, func.count(Order.id).label("count"))
        .group_by(Order.status)
        .all()
    )
    return [{"status": r.status, "count": r.count} for r in rows]
