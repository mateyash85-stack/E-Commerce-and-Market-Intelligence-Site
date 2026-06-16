from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db, User
from controller.orders import place_order, get_orders, get_all_orders, update_order_status
from controller.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/orders", tags=["orders"])


class StatusUpdate(BaseModel):
    status: str


@router.post("")
def checkout(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return place_order(db, current_user.id)


@router.get("")
def my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_orders(db, current_user.id)


@router.get("/admin/all", dependencies=[Depends(require_admin)])
def all_orders(db: Session = Depends(get_db)):
    return get_all_orders(db)


@router.put("/admin/{order_id}/status", dependencies=[Depends(require_admin)])
def set_status(order_id: int, data: StatusUpdate, db: Session = Depends(get_db)):
    return update_order_status(db, order_id, data.status)
