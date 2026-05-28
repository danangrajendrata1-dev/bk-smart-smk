from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.user_model import User


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def list_users(db: Session) -> List[User]:
    return db.query(User).order_by(User.created_at.desc()).all()
