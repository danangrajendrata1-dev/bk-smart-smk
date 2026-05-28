from sqlalchemy import Column, DateTime, String
from datetime import datetime
from app.core.database import Base

class Siswa(Base):
    __tablename__ = "siswa"

    id = Column(String, primary_key=True, index=True)
    foto_url = Column(String(255), nullable=True)
    nama_lengkap = Column(String(255), nullable=False)
    nis = Column(String(50), unique=True, index=True, nullable=False)
    nisn = Column(String(50), unique=True, index=True, nullable=True)
    jenis_kelamin = Column(String(20), nullable=True)
    tempat_lahir = Column(String(100), nullable=True)
    tanggal_lahir = Column(String(20), nullable=True)
    kelas_id = Column(String, nullable=False)
    jurusan = Column(String(100), nullable=True)
    alamat = Column(String(255), nullable=True)
    no_hp_siswa = Column(String(30), nullable=True)
    nama_ortu = Column(String(255), nullable=True)
    no_wa_ortu = Column(String(30), nullable=True)
    status_siswa = Column(String(50), nullable=False, default="aktif")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
