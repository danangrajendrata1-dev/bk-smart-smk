from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class DaftarHadirKonseling(Base):
    __tablename__ = "daftar_hadir_konseling"

    id = Column(String, primary_key=True, index=True)
    konseling_id = Column(String, nullable=False, index=True)
    siswa_id = Column(String, nullable=False, index=True)
    tanggal = Column(String(20), nullable=False)
    waktu_hadir = Column(String(10), nullable=True)
    tanda_tangan_siswa = Column(String, nullable=True)
    status_hadir = Column(String(20), nullable=False, default="hadir")
    catatan = Column(String(255), nullable=True)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
