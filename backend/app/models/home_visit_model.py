from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class HomeVisit(Base):
    __tablename__ = "home_visit"

    id = Column(String, primary_key=True, index=True)
    tanggal_kunjungan = Column(String(20), nullable=False)
    siswa_id = Column(String, nullable=False, index=True)
    kelas_id = Column(String, nullable=False, index=True)
    alamat = Column(String(255), nullable=False)
    tujuan = Column(String(255), nullable=False)
    hasil_observasi = Column(String(255), nullable=True)
    kesimpulan = Column(String(255), nullable=True)
    foto_kunjungan_url = Column(String(255), nullable=True)
    tanda_tangan_ortu = Column(String, nullable=True)
    petugas_id = Column(String, nullable=False)
    status = Column(String(20), nullable=False, default="dijadwalkan")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
