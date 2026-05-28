from sqlalchemy import Column, DateTime, Integer, String
from datetime import datetime
from app.core.database import Base

class Pelanggaran(Base):
    __tablename__ = "pelanggaran"

    id = Column(String, primary_key=True, index=True)
    tanggal_kejadian = Column(String(20), nullable=False)
    siswa_id = Column(String, nullable=False)
    kelas_id = Column(String, nullable=False)
    master_pelanggaran_id = Column(String, nullable=False)
    detail_pelanggaran = Column(String(255), nullable=True)
    poin = Column(Integer, nullable=False, default=0)
    guru_pelapor_id = Column(String, nullable=False)
    bukti_foto_url = Column(String(255), nullable=True)
    tindakan = Column(String(255), nullable=True)
    status_tindak_lanjut = Column(String(50), nullable=False, default="menunggu")
    is_deleted = Column(String(5), nullable=False, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
