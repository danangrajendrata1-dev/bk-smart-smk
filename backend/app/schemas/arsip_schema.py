from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class ArsipCreate(BaseModel):
    tanggal: Optional[str] = None
    jenis_dokumen: str = Field(min_length=1, max_length=50)
    siswa_id: Optional[str] = None
    judul_dokumen: str = Field(min_length=1, max_length=255)
    file_url: Optional[str] = None
    keterangan: Optional[str] = Field(default=None, max_length=255)


class ArsipUpdate(BaseModel):
    tanggal: Optional[str] = None
    jenis_dokumen: Optional[str] = Field(default=None, max_length=50)
    siswa_id: Optional[str] = None
    judul_dokumen: Optional[str] = Field(default=None, max_length=255)
    file_url: Optional[str] = None
    keterangan: Optional[str] = Field(default=None, max_length=255)


class ArsipResponse(ORMModel):
    id: str
    tanggal: str
    jenis_dokumen: str
    siswa_id: Optional[str] = None
    judul_dokumen: str
    file_url: Optional[str] = None
    keterangan: Optional[str] = None
    uploaded_by: str
    created_at: datetime
    updated_at: datetime
