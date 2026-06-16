from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db, User
from controller.cart import get_cart, add_to_cart, update_cart_item, remove_cart_item, clear_cart
from controller.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["cart"])


class AddItemRequest(BaseModel):
    product_id: int
    quantity: int = 1


class UpdateItemRequest(BaseModel):
    quantity: int


@router.get("")
def view_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_cart(db, current_user.id)


@router.post("")
def add_item(data: AddItemRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return add_to_cart(db, current_user.id, data.product_id, data.quantity)


@router.put("/{item_id}")
def update_item(item_id: int, data: UpdateItemRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_cart_item(db, current_user.id, item_id, data.quantity)


@router.delete("/{item_id}")
def remove_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    remove_cart_item(db, current_user.id, item_id)
    return {"detail": "Removed"}


@router.delete("")
def empty_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    clear_cart(db, current_user.id)
    return {"detail": "Cart cleared"}
