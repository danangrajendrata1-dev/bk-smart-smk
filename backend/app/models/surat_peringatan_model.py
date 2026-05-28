from sqlalchemy import Column, DateTime, Integer, String
from datetime import datetime
from app.core.database import Base

class SuratPeringatan(Base):
    __tablename__ = "surat_peringatan"

    id = Column(String, primary_key=True, index=True)
    nomor_surat = Column(String(100), nullable=False, unique=True, index=True)
    tanggal_sp = Column(String(20), nullable=False)
    siswa_id = Column(String, nullable=False, index=True)
    kelas_id = Column(String, nullable=False, index=True)
    jenis_sp = Column(String(20), nullable=False)
    total_poin = Column(Integer, nullable=False, default=0)
    alasan_sp = Column(String(255), nullable=False)
    tindakan = Column(String(255), nullable=True)
    file_pdf_url = Column(String(255), nullable=True)
    status_kirim_wa = Column(String(20), nullable=False, default="belum")
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
