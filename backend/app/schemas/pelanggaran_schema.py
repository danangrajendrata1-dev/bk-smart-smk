from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class PelanggaranBase(BaseModel):
    tanggal_kejadian: str
    siswa_id: str
    master_pelanggaran_id: str
    detail_pelanggaran: Optional[str] = Field(default=None, max_length=255)
    bukti_foto_url: Optional[str] = Field(default=None, max_length=255)
    tindakan: Optional[str] = Field(default=None, max_length=255)
    status_tindak_lanjut: Optional[str] = Field(default="menunggu", max_length=50)


class PelanggaranCreate(PelanggaranBase):
    pass


class PelanggaranUpdate(BaseModel):
    tanggal_kejadian: Optional[str] = None
    siswa_id: Optional[str] = None
    master_pelanggaran_id: Optional[str] = None
    detail_pelanggaran: Optional[str] = Field(default=None, max_length=255)
    bukti_foto_url: Optional[str] = Field(default=None, max_length=255)
    tindakan: Optional[str] = Field(default=None, max_length=255)
    status_tindak_lanjut: Optional[str] = Field(default=None, max_length=50)


class PelanggaranRead(ORMModel):
    id: str
    tanggal_kejadian: str
    siswa_id: str
    kelas_id: str
    master_pelanggaran_id: str
    detail_pelanggaran: Optional[str] = None
    poin: int
    guru_pelapor_id: str
    bukti_foto_url: Optional[str] = None
    tindakan: Optional[str] = None
    status_tindak_lanjut: Optional[str] = None
    created_at: datetime
    updated_at: datetime
