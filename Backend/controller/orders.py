from sqlalchemy.orm import Session
from config.database import Order, OrderItem, CartItem
from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional


class CheckoutRequest(BaseModel):
    # Address
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    pincode: str
    # Payment
    payment_method: str   # upi | card | cod | netbanking


def place_order(db: Session, user_id: int, data: CheckoutRequest):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = sum(item.product.price * item.quantity for item in cart_items)

    # Simulate payment: cod is always "pending", others are "paid"
    payment_status = "pending" if data.payment_method == "cod" else "paid"

    order = Order(
        user_id=user_id,
        total=total,
        status="confirmed",
        full_name=data.full_name,
        phone=data.phone,
        address_line1=data.address_line1,
        address_line2=data.address_line2,
        city=data.city,
        state=data.state,
        pincode=data.pincode,
        payment_method=data.payment_method,
        payment_status=payment_status,
    )
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

    return _serialize(order)


def get_orders(db: Session, user_id: int):
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    return [_serialize(o) for o in orders]


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
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "city": order.city,
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


def _serialize(order: Order):
    return {
        "id": order.id,
        "status": order.status,
        "total": order.total,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "full_name": order.full_name,
        "phone": order.phone,
        "address_line1": order.address_line1,
        "address_line2": order.address_line2,
        "city": order.city,
        "state": order.state,
        "pincode": order.pincode,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "product_id": i.product_id,
                "name": i.product.name,
                "quantity": i.quantity,
                "price": i.price,
                "image_url": i.product.image_url,
            }
            for i in order.items
        ],
    }
