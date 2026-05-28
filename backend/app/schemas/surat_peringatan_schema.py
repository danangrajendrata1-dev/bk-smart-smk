from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class SuratPeringatanCreate(BaseModel):
    siswa_id: str
    alasan_sp: str = Field(min_length=1, max_length=255)
    tindakan: str = Field(min_length=1, max_length=255)


class SuratPeringatanUpdate(BaseModel):
    alasan_sp: Optional[str] = Field(default=None, max_length=255)
    tindakan: Optional[str] = Field(default=None, max_length=255)
    status_kirim_wa: Optional[str] = Field(default=None, max_length=20)


class SuratPeringatanResponse(ORMModel):
    id: str
    nomor_surat: str
    tanggal_sp: str
    siswa_id: str
    kelas_id: str
    jenis_sp: str
    total_poin: int
    alasan_sp: str
    tindakan: Optional[str] = None
    file_pdf_url: Optional[str] = None
    status_kirim_wa: str
    created_by: str
    created_at: datetime
    updated_at: datetime


class SuratPeringatanRecommendationResponse(BaseModel):
    siswa_id: str
    total_poin: int
    status_pembinaan: str
    rekomendasi: Optional[dict] = None
    riwayat_surat_peringatan: list[dict] = []
