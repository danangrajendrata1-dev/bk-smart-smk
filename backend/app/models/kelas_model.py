from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class Kelas(Base):
    __tablename__ = "kelas"

    id = Column(String, primary_key=True, index=True)
    nama_kelas = Column(String(100), nullable=False)
    tingkat = Column(String(20), nullable=False)
    jurusan = Column(String(100), nullable=False)
    wali_kelas_id = Column(String, nullable=True)
    tahun_ajaran = Column(String(20), nullable=True)
    status = Column(String(50), nullable=False, default="aktif")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
