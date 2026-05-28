from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class HomeVisitCreate(BaseModel):
    tanggal_kunjungan: Optional[str] = None
    siswa_id: str
    alamat: Optional[str] = Field(default=None, max_length=255)
    tujuan: str = Field(min_length=1, max_length=255)
    hasil_observasi: Optional[str] = Field(default=None, max_length=255)
    kesimpulan: Optional[str] = Field(default=None, max_length=255)
    foto_kunjungan_url: Optional[str] = Field(default=None, max_length=255)
    tanda_tangan_ortu: Optional[str] = None
    status: Optional[str] = Field(default="dijadwalkan", max_length=20)


class HomeVisitUpdate(BaseModel):
    tanggal_kunjungan: Optional[str] = None
    siswa_id: Optional[str] = None
    alamat: Optional[str] = Field(default=None, max_length=255)
    tujuan: Optional[str] = Field(default=None, max_length=255)
    hasil_observasi: Optional[str] = Field(default=None, max_length=255)
    kesimpulan: Optional[str] = Field(default=None, max_length=255)
    foto_kunjungan_url: Optional[str] = Field(default=None, max_length=255)
    tanda_tangan_ortu: Optional[str] = None
    status: Optional[str] = Field(default=None, max_length=20)


class HomeVisitResponse(ORMModel):
    id: str
    tanggal_kunjungan: str
    siswa_id: str
    kelas_id: str
    alamat: str
    tujuan: str
    hasil_observasi: Optional[str] = None
    kesimpulan: Optional[str] = None
    foto_kunjungan_url: Optional[str] = None
    tanda_tangan_ortu: Optional[str] = None
    petugas_id: str
    status: str
    created_at: datetime
    updated_at: datetime


class HomeVisitDetailResponse(HomeVisitResponse):
    pass
