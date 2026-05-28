from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class KelasBase(BaseModel):
    nama_kelas: str = Field(min_length=1, max_length=100)
    tingkat: str = Field(min_length=1, max_length=20)
    jurusan: str = Field(min_length=1, max_length=100)
    wali_kelas_id: Optional[str] = None
    tahun_ajaran: Optional[str] = Field(default=None, max_length=20)
    status: Optional[str] = Field(default="aktif", max_length=50)


class KelasCreate(KelasBase):
    pass


class KelasUpdate(BaseModel):
    nama_kelas: Optional[str] = Field(default=None, max_length=100)
    tingkat: Optional[str] = Field(default=None, max_length=20)
    jurusan: Optional[str] = Field(default=None, max_length=100)
    wali_kelas_id: Optional[str] = None
    tahun_ajaran: Optional[str] = Field(default=None, max_length=20)
    status: Optional[str] = Field(default=None, max_length=50)


class KelasRead(ORMModel):
    id: str
    nama_kelas: str
    tingkat: str
    jurusan: str
    wali_kelas_id: Optional[str] = None
    tahun_ajaran: Optional[str] = None
    status: Optional[str] = None
    created_at: datetime
    updated_at: datetime
