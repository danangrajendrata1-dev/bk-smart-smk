from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class PemanggilanOrtuCreate(BaseModel):
    tanggal: Optional[str] = None
    siswa_id: str
    alasan_pemanggilan: str = Field(min_length=1, max_length=255)
    hasil_pertemuan: Optional[str] = Field(default=None, max_length=255)
    kesepakatan: Optional[str] = Field(default=None, max_length=255)
    dokumentasi_url: Optional[str] = Field(default=None, max_length=255)
    tanda_tangan_ortu: Optional[str] = None
    status: Optional[str] = Field(default="dijadwalkan", max_length=20)


class PemanggilanOrtuUpdate(BaseModel):
    tanggal: Optional[str] = None
    siswa_id: Optional[str] = None
    alasan_pemanggilan: Optional[str] = Field(default=None, max_length=255)
    hasil_pertemuan: Optional[str] = Field(default=None, max_length=255)
    kesepakatan: Optional[str] = Field(default=None, max_length=255)
    dokumentasi_url: Optional[str] = Field(default=None, max_length=255)
    tanda_tangan_ortu: Optional[str] = None
    status: Optional[str] = Field(default=None, max_length=20)


class PemanggilanOrtuResponse(ORMModel):
    id: str
    tanggal: str
    siswa_id: str
    kelas_id: str
    alasan_pemanggilan: str
    hasil_pertemuan: Optional[str] = None
    kesepakatan: Optional[str] = None
    dokumentasi_url: Optional[str] = None
    tanda_tangan_ortu: Optional[str] = None
    petugas_id: str
    status: str
    created_at: datetime
    updated_at: datetime


class PemanggilanOrtuDetailResponse(PemanggilanOrtuResponse):
    pass
