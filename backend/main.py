from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import Base, engine
from app import models  # noqa: F401
from app.routers import api_router

app = FastAPI(title=settings.APP_NAME)

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    if settings.DATABASE_URL.startswith("sqlite"):
        with engine.begin() as connection:
            table_columns = {
                "daftar_hadir_konseling": {
                    "tanggal": "ALTER TABLE daftar_hadir_konseling ADD COLUMN tanggal VARCHAR(20)",
                    "waktu_hadir": "ALTER TABLE daftar_hadir_konseling ADD COLUMN waktu_hadir VARCHAR(10)",
                    "tanda_tangan_siswa": "ALTER TABLE daftar_hadir_konseling ADD COLUMN tanda_tangan_siswa VARCHAR",
                    "status_hadir": "ALTER TABLE daftar_hadir_konseling ADD COLUMN status_hadir VARCHAR(20)",
                    "catatan": "ALTER TABLE daftar_hadir_konseling ADD COLUMN catatan VARCHAR(255)",
                    "created_by": "ALTER TABLE daftar_hadir_konseling ADD COLUMN created_by VARCHAR",
                },
                "surat_peringatan": {
                    "nomor_surat": "ALTER TABLE surat_peringatan ADD COLUMN nomor_surat VARCHAR(100)",
                    "tanggal_sp": "ALTER TABLE surat_peringatan ADD COLUMN tanggal_sp VARCHAR(20)",
                    "kelas_id": "ALTER TABLE surat_peringatan ADD COLUMN kelas_id VARCHAR",
                    "total_poin": "ALTER TABLE surat_peringatan ADD COLUMN total_poin INTEGER DEFAULT 0",
                    "alasan_sp": "ALTER TABLE surat_peringatan ADD COLUMN alasan_sp VARCHAR(255)",
                    "tindakan": "ALTER TABLE surat_peringatan ADD COLUMN tindakan VARCHAR(255)",
                    "file_pdf_url": "ALTER TABLE surat_peringatan ADD COLUMN file_pdf_url VARCHAR(255)",
                    "status_kirim_wa": "ALTER TABLE surat_peringatan ADD COLUMN status_kirim_wa VARCHAR(20)",
                    "created_by": "ALTER TABLE surat_peringatan ADD COLUMN created_by VARCHAR",
                },
                "arsip_dokumen": {
                    "tanggal": "ALTER TABLE arsip_dokumen ADD COLUMN tanggal VARCHAR(20)",
                    "jenis_dokumen": "ALTER TABLE arsip_dokumen ADD COLUMN jenis_dokumen VARCHAR(50)",
                    "siswa_id": "ALTER TABLE arsip_dokumen ADD COLUMN siswa_id VARCHAR",
                    "judul_dokumen": "ALTER TABLE arsip_dokumen ADD COLUMN judul_dokumen VARCHAR(255)",
                    "keterangan": "ALTER TABLE arsip_dokumen ADD COLUMN keterangan VARCHAR(255)",
                    "uploaded_by": "ALTER TABLE arsip_dokumen ADD COLUMN uploaded_by VARCHAR",
                },
                "pemanggilan_ortu": {
                    "tanggal": "ALTER TABLE pemanggilan_ortu ADD COLUMN tanggal VARCHAR(20)",
                    "kelas_id": "ALTER TABLE pemanggilan_ortu ADD COLUMN kelas_id VARCHAR",
                    "alasan_pemanggilan": "ALTER TABLE pemanggilan_ortu ADD COLUMN alasan_pemanggilan VARCHAR(255)",
                    "hasil_pertemuan": "ALTER TABLE pemanggilan_ortu ADD COLUMN hasil_pertemuan VARCHAR(255)",
                    "kesepakatan": "ALTER TABLE pemanggilan_ortu ADD COLUMN kesepakatan VARCHAR(255)",
                    "dokumentasi_url": "ALTER TABLE pemanggilan_ortu ADD COLUMN dokumentasi_url VARCHAR(255)",
                    "tanda_tangan_ortu": "ALTER TABLE pemanggilan_ortu ADD COLUMN tanda_tangan_ortu VARCHAR",
                    "petugas_id": "ALTER TABLE pemanggilan_ortu ADD COLUMN petugas_id VARCHAR",
                    "status": "ALTER TABLE pemanggilan_ortu ADD COLUMN status VARCHAR(20)",
                },
                "home_visit": {
                    "tanggal_kunjungan": "ALTER TABLE home_visit ADD COLUMN tanggal_kunjungan VARCHAR(20)",
                    "kelas_id": "ALTER TABLE home_visit ADD COLUMN kelas_id VARCHAR",
                    "alamat": "ALTER TABLE home_visit ADD COLUMN alamat VARCHAR(255)",
                    "tujuan": "ALTER TABLE home_visit ADD COLUMN tujuan VARCHAR(255)",
                    "hasil_observasi": "ALTER TABLE home_visit ADD COLUMN hasil_observasi VARCHAR(255)",
                    "kesimpulan": "ALTER TABLE home_visit ADD COLUMN kesimpulan VARCHAR(255)",
                    "foto_kunjungan_url": "ALTER TABLE home_visit ADD COLUMN foto_kunjungan_url VARCHAR(255)",
                    "tanda_tangan_ortu": "ALTER TABLE home_visit ADD COLUMN tanda_tangan_ortu VARCHAR",
                    "petugas_id": "ALTER TABLE home_visit ADD COLUMN petugas_id VARCHAR",
                    "status": "ALTER TABLE home_visit ADD COLUMN status VARCHAR(20)",
                },
            }
            for table_name, columns in table_columns.items():
                try:
                    existing_columns = {
                        row[1]
                        for row in connection.execute(text(f"PRAGMA table_info({table_name})")).fetchall()
                    }
                except Exception:
                    existing_columns = set()
                if not existing_columns:
                    continue
                for column_name, statement in columns.items():
                    if column_name not in existing_columns:
                        connection.execute(text(statement))


@app.get("/")
def root():
    return {"status": "success", "message": "BK SMART SMK API is running", "data": {}}
