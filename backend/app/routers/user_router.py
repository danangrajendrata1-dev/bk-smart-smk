from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.auth_schema import UserCreate, UserRead
from app.services.user_service import create_new_user, get_user_detail, get_users
from app.utils.response import success_response

router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
def read_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin")),
):
    users = get_users(db)
    return success_response(
        "Daftar user berhasil diambil",
        [UserRead.model_validate(user).model_dump() for user in users],
    )


@router.get("/{user_id}")
def read_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin")),
):
    user = get_user_detail(db, user_id)
    return success_response(
        "Detail user berhasil diambil",
        UserRead.model_validate(user).model_dump(),
    )


@router.post("")
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin")),
):
    user = create_new_user(db, payload)
    return success_response(
        "User berhasil dibuat",
        UserRead.model_validate(user).model_dump(),
    )
