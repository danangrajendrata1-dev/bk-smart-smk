from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class KonselingCreate(BaseModel):
    tanggal: str
    siswa_id: str
    jenis_konseling: str = Field(min_length=1, max_length=50)
    permasalahan: str = Field(min_length=1, max_length=255)
    hasil_konseling: Optional[str] = Field(default=None, max_length=255)
    tindak_lanjut: Optional[str] = Field(default=None, max_length=255)
    jadwal_berikutnya: Optional[str] = Field(default=None, max_length=20)
    catatan_rahasia: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default="terjadwal", max_length=50)


class KonselingUpdate(BaseModel):
    tanggal: Optional[str] = None
    siswa_id: Optional[str] = None
    jenis_konseling: Optional[str] = Field(default=None, max_length=50)
    permasalahan: Optional[str] = Field(default=None, max_length=255)
    hasil_konseling: Optional[str] = Field(default=None, max_length=255)
    tindak_lanjut: Optional[str] = Field(default=None, max_length=255)
    jadwal_berikutnya: Optional[str] = Field(default=None, max_length=20)
    catatan_rahasia: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default=None, max_length=50)


class KonselingResponse(ORMModel):
    id: str
    tanggal: str
    siswa_id: str
    kelas_id: str
    jenis_konseling: str
    permasalahan: str
    hasil_konseling: Optional[str] = None
    tindak_lanjut: Optional[str] = None
    jadwal_berikutnya: Optional[str] = None
    konselor_id: str
    status: str
    created_at: datetime
    updated_at: datetime


class KonselingDetailResponse(KonselingResponse):
    catatan_rahasia: Optional[str] = None
