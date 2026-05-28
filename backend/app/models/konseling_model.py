from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class Konseling(Base):
    __tablename__ = "konseling"

    id = Column(String, primary_key=True, index=True)
    tanggal = Column(String(20), nullable=False)
    siswa_id = Column(String, nullable=False)
    kelas_id = Column(String, nullable=False)
    jenis_konseling = Column(String(50), nullable=False)
    permasalahan = Column(String(255), nullable=False)
    hasil_konseling = Column(String(255), nullable=True)
    tindak_lanjut = Column(String(255), nullable=True)
    jadwal_berikutnya = Column(String(20), nullable=True)
    konselor_id = Column(String, nullable=False)
    catatan_rahasia = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="terjadwal")
    is_deleted = Column(String(5), nullable=False, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
