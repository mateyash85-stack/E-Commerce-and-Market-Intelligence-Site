from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from config.database import get_db
from controller.products import get_products, get_product, create_product, update_product, delete_product, ProductCreate, ProductUpdate
from controller.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    from config.database import Product
    rows = db.query(Product.category).distinct().filter(Product.category != None).all()
    return [r[0] for r in rows]


def serialize(p):
    return {
        "id": p.id, "name": p.name, "description": p.description,
        "price": p.price, "category": p.category, "image_url": p.image_url,
        "stock": p.stock, "rating": p.rating, "reviews_count": p.reviews_count
    }


@router.get("")
def list_products(category: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return [serialize(p) for p in get_products(db, category=category, search=search, skip=skip, limit=limit)]


@router.get("/{product_id}")
def retrieve_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize(product)


@router.post("", status_code=201, dependencies=[Depends(require_admin)])
def add_product(data: ProductCreate, db: Session = Depends(get_db)):
    return serialize(create_product(db, data))


@router.put("/{product_id}", dependencies=[Depends(require_admin)])
def edit_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = update_product(db, product_id, data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize(product)


@router.delete("/{product_id}", dependencies=[Depends(require_admin)])
def remove_product(product_id: int, db: Session = Depends(get_db)):
    product = delete_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": "Deleted"}
