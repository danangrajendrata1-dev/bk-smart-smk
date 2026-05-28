from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class LaporanFilter(BaseModel):
    tanggal_awal: Optional[str] = None
    tanggal_akhir: Optional[str] = None
    kelas_id: Optional[str] = None
    siswa_id: Optional[str] = None
    jenis: Optional[str] = None
    status: Optional[str] = None


class LaporanSummaryItem(BaseModel):
    label: str
    value: int | float | str
    detail: Optional[str] = None


class LaporanSummaryResponse(ORMModel):
    generated_at: datetime
    cards: list[LaporanSummaryItem]
    highlights: dict[str, Any]

