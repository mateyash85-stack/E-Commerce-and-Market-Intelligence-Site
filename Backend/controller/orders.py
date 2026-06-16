from sqlalchemy.orm import Session
from config.database import Order, OrderItem, CartItem
from fastapi import HTTPException


def place_order(db: Session, user_id: int):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = sum(item.product.price * item.quantity for item in cart_items)
    order = Order(user_id=user_id, total=total, status="pending")
    db.add(order)
    db.flush()

    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price,
        )
        db.add(order_item)

    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
    db.refresh(order)
    return {
        "id": order.id,
        "status": order.status,
        "total": order.total,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "product_id": i.product_id,
                "name": i.product.name,
                "quantity": i.quantity,
                "price": i.price,
            }
            for i in order.items
        ],
    }


def get_orders(db: Session, user_id: int):
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "status": order.status,
            "total": order.total,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "product_id": i.product_id,
                    "name": i.product.name,
                    "quantity": i.quantity,
                    "price": i.price,
                }
                for i in order.items
            ],
        })
    return result


def get_all_orders(db: Session):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "user_email": order.user.email,
            "status": order.status,
            "total": order.total,
            "created_at": order.created_at.isoformat(),
        })
    return result


def update_order_status(db: Session, order_id: int, status: str):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return order
