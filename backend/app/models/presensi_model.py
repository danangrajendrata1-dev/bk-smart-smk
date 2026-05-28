from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class Presensi(Base):
    __tablename__ = "presensi"

    id = Column(String, primary_key=True, index=True)
    siswa_id = Column(String, nullable=True)
    kelas_id = Column(String, nullable=True)
    tanggal = Column(String(20), nullable=True)
    status = Column(String(20), nullable=True)
    keterangan = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
