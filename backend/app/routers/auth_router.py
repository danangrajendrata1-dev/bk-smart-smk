from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth_schema import AuthResponse, UserCreate, UserLogin, UserRead
from app.services.auth_service import (
    authenticate_user,
    build_access_token,
    create_user,
    get_current_user_from_token,
)
from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(payload: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, payload)
    token = build_access_token(user)
    return success_response(
        "Registrasi berhasil",
        {
            "user": UserRead.model_validate(user).model_dump(),
            "access_token": token,
            "token_type": "bearer",
        },
    )


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload)
    token = build_access_token(user)
    return success_response(
        "Login berhasil",
        {
            "user": UserRead.model_validate(user).model_dump(),
            "access_token": token,
            "token_type": "bearer",
        },
    )


@router.get("/me")
def me(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak ditemukan",
        )

    token = authorization.removeprefix("Bearer ").strip()
    user = get_current_user_from_token(db, token)
    return success_response("Profil user berhasil diambil", UserRead.model_validate(user).model_dump())
