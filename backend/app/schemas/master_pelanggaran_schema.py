from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class MasterPelanggaranBase(BaseModel):
    jenis_pelanggaran: str = Field(min_length=1, max_length=255)
    kategori: Optional[str] = Field(default=None, max_length=100)
    poin: int = Field(ge=0)
    tindakan_default: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default="aktif", max_length=50)


class MasterPelanggaranCreate(MasterPelanggaranBase):
    pass


class MasterPelanggaranUpdate(BaseModel):
    jenis_pelanggaran: Optional[str] = Field(default=None, max_length=255)
    kategori: Optional[str] = Field(default=None, max_length=100)
    poin: Optional[int] = Field(default=None, ge=0)
    tindakan_default: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default=None, max_length=50)


class MasterPelanggaranRead(ORMModel):
    id: str
    jenis_pelanggaran: str
    kategori: Optional[str] = None
    poin: int
    tindakan_default: Optional[str] = None
    status: Optional[str] = None
    created_at: datetime
    updated_at: datetime
