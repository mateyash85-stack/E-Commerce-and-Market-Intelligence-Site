from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from controller.users import get_all_users, update_user_role, delete_user
from controller.auth import require_admin, get_current_user
from config.database import User

router = APIRouter(prefix="/api/users", tags=["users"])


class RoleUpdate(BaseModel):
    role: str


@router.get("", dependencies=[Depends(require_admin)])
def list_users(db: Session = Depends(get_db)):
    return get_all_users(db)


@router.put("/{user_id}/role", dependencies=[Depends(require_admin)])
def change_role(user_id: int, data: RoleUpdate, db: Session = Depends(get_db)):
    return update_user_role(db, user_id, data.role)


@router.delete("/{user_id}", dependencies=[Depends(require_admin)])
def remove_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return delete_user(db, user_id, current_user.id)
