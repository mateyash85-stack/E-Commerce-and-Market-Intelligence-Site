from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from controller.analytics import get_dashboard_stats, get_sales_over_time, get_top_products, get_category_breakdown, get_order_status_breakdown
from controller.auth import require_admin

router = APIRouter(prefix="/api/analytics", tags=["analytics"], dependencies=[Depends(require_admin)])


@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)


@router.get("/sales")
def sales(days: int = 30, db: Session = Depends(get_db)):
    return get_sales_over_time(db, days)


@router.get("/top-products")
def top_products(limit: int = 5, db: Session = Depends(get_db)):
    return get_top_products(db, limit)


@router.get("/categories")
def categories(db: Session = Depends(get_db)):
    return get_category_breakdown(db)


@router.get("/order-status")
def order_status(db: Session = Depends(get_db)):
    return get_order_status_breakdown(db)
