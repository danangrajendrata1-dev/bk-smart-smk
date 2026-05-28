from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class DaftarHadirKonselingCreate(BaseModel):
    konseling_id: str
    siswa_id: Optional[str] = None
    tanggal: Optional[str] = None
    waktu_hadir: Optional[str] = None
    tanda_tangan_siswa: Optional[str] = None
    status_hadir: str = Field(default="hadir", max_length=20)
    catatan: Optional[str] = Field(default=None, max_length=255)


class DaftarHadirKonselingUpdate(BaseModel):
    konseling_id: Optional[str] = None
    siswa_id: Optional[str] = None
    tanggal: Optional[str] = None
    waktu_hadir: Optional[str] = None
    tanda_tangan_siswa: Optional[str] = None
    status_hadir: Optional[str] = Field(default=None, max_length=20)
    catatan: Optional[str] = Field(default=None, max_length=255)


class DaftarHadirKonselingResponse(ORMModel):
    id: str
    konseling_id: str
    siswa_id: str
    tanggal: str
    waktu_hadir: Optional[str] = None
    tanda_tangan_siswa: Optional[str] = None
    status_hadir: str
    catatan: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: datetime
