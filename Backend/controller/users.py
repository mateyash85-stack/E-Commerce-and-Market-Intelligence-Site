from sqlalchemy.orm import Session
from sqlalchemy import func
from config.database import User, Order
from fastapi import HTTPException


def get_all_users(db: Session):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        order_count = db.query(func.count(Order.id)).filter(Order.user_id == u.id).scalar() or 0
        total_spent = db.query(func.sum(Order.total)).filter(
            Order.user_id == u.id, Order.status != "cancelled"
        ).scalar() or 0
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at.isoformat(),
            "order_count": order_count,
            "total_spent": round(total_spent, 2),
        })
    return result


def update_user_role(db: Session, user_id: int, role: str):
    allowed_roles = {"customer", "admin"}
    if role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {allowed_roles}")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


def delete_user(db: Session, user_id: int, current_user_id: int):
    if user_id == current_user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}
