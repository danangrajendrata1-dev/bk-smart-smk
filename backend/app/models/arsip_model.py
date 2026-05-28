from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class Arsip(Base):
    __tablename__ = "arsip_dokumen"

    id = Column(String, primary_key=True, index=True)
    tanggal = Column(String(20), nullable=False)
    jenis_dokumen = Column(String(50), nullable=False, index=True)
    siswa_id = Column(String, nullable=True, index=True)
    judul_dokumen = Column(String(255), nullable=False)
    file_url = Column(String(255), nullable=True)
    keterangan = Column(String(255), nullable=True)
    uploaded_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
