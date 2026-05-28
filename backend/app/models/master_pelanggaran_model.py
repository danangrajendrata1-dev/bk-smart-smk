from sqlalchemy import Column, DateTime, Integer, String
from datetime import datetime
from app.core.database import Base

class MasterPelanggaran(Base):
    __tablename__ = "master_pelanggaran"

    id = Column(String, primary_key=True, index=True)
    jenis_pelanggaran = Column(String(255), nullable=False)
    kategori = Column(String(100), nullable=True)
    poin = Column(Integer, nullable=False, default=0)
    tindakan_default = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="aktif")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
