from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class LogActivity(Base):
    __tablename__ = "log_aktivitas"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    aksi = Column(String(255), nullable=True)
    detail = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
