from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class PemanggilanOrtu(Base):
    __tablename__ = "pemanggilan_ortu"

    id = Column(String, primary_key=True, index=True)
    tanggal = Column(String(20), nullable=False)
    siswa_id = Column(String, nullable=False, index=True)
    kelas_id = Column(String, nullable=False, index=True)
    alasan_pemanggilan = Column(String(255), nullable=False)
    hasil_pertemuan = Column(String(255), nullable=True)
    kesepakatan = Column(String(255), nullable=True)
    dokumentasi_url = Column(String(255), nullable=True)
    tanda_tangan_ortu = Column(String, nullable=True)
    petugas_id = Column(String, nullable=False)
    status = Column(String(20), nullable=False, default="dijadwalkan")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
