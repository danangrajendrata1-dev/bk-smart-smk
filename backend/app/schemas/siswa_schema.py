from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class SiswaBase(BaseModel):
    foto_url: Optional[str] = None
    nama_lengkap: str = Field(min_length=1, max_length=255)
    nis: str = Field(min_length=1, max_length=50)
    nisn: Optional[str] = Field(default=None, max_length=50)
    jenis_kelamin: Optional[str] = Field(default=None, max_length=20)
    tempat_lahir: Optional[str] = Field(default=None, max_length=100)
    tanggal_lahir: Optional[str] = Field(default=None, max_length=20)
    kelas_id: str = Field(min_length=1)
    jurusan: Optional[str] = Field(default=None, max_length=100)
    alamat: Optional[str] = Field(default=None, max_length=255)
    no_hp_siswa: Optional[str] = Field(default=None, max_length=30)
    nama_ortu: Optional[str] = Field(default=None, max_length=255)
    no_wa_ortu: Optional[str] = Field(default=None, max_length=30)
    status_siswa: Optional[str] = Field(default="aktif", max_length=50)


class SiswaCreate(SiswaBase):
    pass


class SiswaUpdate(BaseModel):
    foto_url: Optional[str] = None
    nama_lengkap: Optional[str] = Field(default=None, max_length=255)
    nis: Optional[str] = Field(default=None, max_length=50)
    nisn: Optional[str] = Field(default=None, max_length=50)
    jenis_kelamin: Optional[str] = Field(default=None, max_length=20)
    tempat_lahir: Optional[str] = Field(default=None, max_length=100)
    tanggal_lahir: Optional[str] = Field(default=None, max_length=20)
    kelas_id: Optional[str] = None
    jurusan: Optional[str] = Field(default=None, max_length=100)
    alamat: Optional[str] = Field(default=None, max_length=255)
    no_hp_siswa: Optional[str] = Field(default=None, max_length=30)
    nama_ortu: Optional[str] = Field(default=None, max_length=255)
    no_wa_ortu: Optional[str] = Field(default=None, max_length=30)
    status_siswa: Optional[str] = Field(default=None, max_length=50)


class SiswaRead(ORMModel):
    id: str
    foto_url: Optional[str] = None
    nama_lengkap: str
    nis: str
    nisn: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    tempat_lahir: Optional[str] = None
    tanggal_lahir: Optional[str] = None
    kelas_id: str
    jurusan: Optional[str] = None
    alamat: Optional[str] = None
    no_hp_siswa: Optional[str] = None
    nama_ortu: Optional[str] = None
    no_wa_ortu: Optional[str] = None
    status_siswa: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class SiswaProfileRead(SiswaRead):
    total_poin: int = 0
    status_pembinaan: Optional[str] = None
    rekomendasi_sp: Optional[str] = None
    riwayat_pelanggaran: list[dict] = []
    riwayat_konseling: list[dict] = []
    jumlah_konseling: int = 0
    jadwal_konseling_berikutnya: Optional[str] = None
    riwayat_hadir_konseling: list[dict] = []
    riwayat_surat_peringatan: list[dict] = []
    arsip_dokumen: list[dict] = []
    riwayat_pemanggilan_ortu: list[dict] = []
    riwayat_home_visit: list[dict] = []
