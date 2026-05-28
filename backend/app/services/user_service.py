from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user_model import User
from app.repositories.user_repository import get_user_by_email, get_user_by_id, list_users
from app.schemas.auth_schema import UserCreate

ALLOWED_ROLES = {
    "admin",
    "guru_bk",
    "wali_kelas",
    "kesiswaan",
    "kepala_sekolah",
}


def get_users(db: Session):
    return list_users(db)


def get_user_detail(db: Session, user_id: str):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan",
        )
    return user


def create_new_user(db: Session, payload: UserCreate):
    if payload.role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role tidak valid",
        )

    existing_user = get_user_by_email(db, payload.email.lower())
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar",
        )

    user = User(
        id=str(uuid4()),
        email=payload.email.lower(),
        full_name=payload.full_name.strip(),
        role=payload.role,
        hashed_password=hash_password(payload.password),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
