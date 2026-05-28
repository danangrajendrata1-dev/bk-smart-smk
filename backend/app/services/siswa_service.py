from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.siswa_model import Siswa
from app.repositories.kelas_repository import get_kelas
from app.repositories.siswa_repository import (
    create_siswa as repo_create_siswa,
    delete_siswa as repo_delete_siswa,
    get_siswa as repo_get_siswa,
    get_siswa_by_nis,
    get_siswa_by_nisn,
    list_siswa as repo_list_siswa,
)
from app.schemas.siswa_schema import SiswaCreate, SiswaProfileRead, SiswaUpdate
from app.services.pelanggaran_service import get_rekomendasi_sp, get_status_pembinaan as get_status_pembinaan_for_poin, get_total_poin_siswa
from app.repositories.konseling_repository import get_by_siswa_id
from app.repositories.daftar_hadir_konseling_repository import get_by_siswa_id as get_daftar_hadir_by_siswa
from app.repositories.surat_peringatan_repository import get_by_siswa_id as get_sp_by_siswa
from app.repositories.arsip_repository import list_arsip as list_arsip_repo
from app.repositories.pemanggilan_ortu_repository import get_by_siswa_id as get_pemanggilan_by_siswa
from app.repositories.home_visit_repository import get_by_siswa_id as get_home_visit_by_siswa
from app.utils.crud_helper import new_id, now_utc


def list_data(db: Session, search: str | None = None, kelas_id: str | None = None, status_siswa: str | None = None):
    return repo_list_siswa(db, search=search, kelas_id=kelas_id, status_siswa=status_siswa)


def get_detail(db: Session, siswa_id: str):
    siswa = repo_get_siswa(db, siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")
    return siswa


def create_data(db: Session, payload: SiswaCreate):
    if get_siswa_by_nis(db, payload.nis):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NIS sudah digunakan")
    if payload.nisn and get_siswa_by_nisn(db, payload.nisn):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NISN sudah digunakan")

    kelas = get_kelas(db, payload.kelas_id)
    if not kelas:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kelas tidak valid")

    siswa = Siswa(
        id=new_id(),
        foto_url=payload.foto_url,
        nama_lengkap=payload.nama_lengkap,
        nis=payload.nis,
        nisn=payload.nisn,
        jenis_kelamin=payload.jenis_kelamin,
        tempat_lahir=payload.tempat_lahir,
        tanggal_lahir=payload.tanggal_lahir,
        kelas_id=payload.kelas_id,
        jurusan=payload.jurusan or kelas.jurusan,
        alamat=payload.alamat,
        no_hp_siswa=payload.no_hp_siswa,
        nama_ortu=payload.nama_ortu,
        no_wa_ortu=payload.no_wa_ortu,
        status_siswa=payload.status_siswa or "aktif",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    return repo_create_siswa(db, siswa)


def update_data(db: Session, siswa_id: str, payload: SiswaUpdate):
    siswa = get_detail(db, siswa_id)
    data = payload.model_dump(exclude_unset=True)
    if "nis" in data and data["nis"] and data["nis"] != siswa.nis and get_siswa_by_nis(db, data["nis"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NIS sudah digunakan")
    if "nisn" in data and data["nisn"] and data["nisn"] != siswa.nisn and get_siswa_by_nisn(db, data["nisn"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NISN sudah digunakan")
    if "kelas_id" in data and data["kelas_id"]:
        kelas = get_kelas(db, data["kelas_id"])
        if not kelas:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kelas tidak valid")
        siswa.jurusan = data.get("jurusan") or kelas.jurusan
    for field, value in data.items():
        setattr(siswa, field, value)
    siswa.updated_at = now_utc()
    db.commit()
    db.refresh(siswa)
    return siswa


def delete_data(db: Session, siswa_id: str):
    siswa = get_detail(db, siswa_id)
    return repo_delete_siswa(db, siswa)


def get_profile(db: Session, siswa_id: str):
    siswa = get_detail(db, siswa_id)
    total_poin = get_total_poin_siswa(db, siswa_id)
    riwayat_konseling = get_by_siswa_id(db, siswa_id)
    riwayat_hadir_konseling = get_daftar_hadir_by_siswa(db, siswa_id)
    riwayat_surat_peringatan = get_sp_by_siswa(db, siswa_id)
    arsip_dokumen = list_arsip_repo(db, {"siswa_id": siswa_id})
    riwayat_pemanggilan_ortu = get_pemanggilan_by_siswa(db, siswa_id)
    riwayat_home_visit = get_home_visit_by_siswa(db, siswa_id)
    siswa_data = {
        "id": siswa.id,
        "foto_url": siswa.foto_url,
        "nama_lengkap": siswa.nama_lengkap,
        "nis": siswa.nis,
        "nisn": siswa.nisn,
        "jenis_kelamin": siswa.jenis_kelamin,
        "tempat_lahir": siswa.tempat_lahir,
        "tanggal_lahir": siswa.tanggal_lahir,
        "kelas_id": siswa.kelas_id,
        "jurusan": siswa.jurusan,
        "alamat": siswa.alamat,
        "no_hp_siswa": siswa.no_hp_siswa,
        "nama_ortu": siswa.nama_ortu,
        "no_wa_ortu": siswa.no_wa_ortu,
        "status_siswa": siswa.status_siswa,
        "created_at": siswa.created_at,
        "updated_at": siswa.updated_at,
        "total_poin": total_poin,
        "status_pembinaan": get_status_pembinaan_for_poin(total_poin),
        "riwayat_konseling": [
            {
                "id": item.id,
                "tanggal": item.tanggal,
                "jenis_konseling": item.jenis_konseling,
                "permasalahan": item.permasalahan,
                "hasil_konseling": item.hasil_konseling,
                "tindak_lanjut": item.tindak_lanjut,
                "jadwal_berikutnya": item.jadwal_berikutnya,
                "status": item.status,
            }
            for item in riwayat_konseling
        ],
        "jumlah_konseling": len(riwayat_konseling),
        "jadwal_konseling_berikutnya": next((item.jadwal_berikutnya for item in riwayat_konseling if item.jadwal_berikutnya), None),
        "riwayat_hadir_konseling": [
            {
                "id": item.id,
                "konseling_id": item.konseling_id,
                "siswa_id": item.siswa_id,
                "tanggal": item.tanggal,
                "waktu_hadir": item.waktu_hadir,
                "status_hadir": item.status_hadir,
                "catatan": item.catatan,
                "tanda_tangan_siswa": item.tanda_tangan_siswa,
                "created_by": item.created_by,
            }
            for item in riwayat_hadir_konseling
        ],
        "riwayat_surat_peringatan": [
            {
                "id": item.id,
                "nomor_surat": item.nomor_surat,
                "tanggal_sp": item.tanggal_sp,
                "jenis_sp": item.jenis_sp,
                "total_poin": item.total_poin,
                "alasan_sp": item.alasan_sp,
                "tindakan": item.tindakan,
                "file_pdf_url": item.file_pdf_url,
            }
            for item in riwayat_surat_peringatan
        ],
        "arsip_dokumen": [
            {
                "id": item.id,
                "tanggal": item.tanggal,
                "jenis_dokumen": item.jenis_dokumen,
                "judul_dokumen": item.judul_dokumen,
                "file_url": item.file_url,
                "keterangan": item.keterangan,
            }
            for item in arsip_dokumen
        ],
        "riwayat_pemanggilan_ortu": [
            {
                "id": item.id,
                "tanggal": item.tanggal,
                "alasan_pemanggilan": item.alasan_pemanggilan,
                "hasil_pertemuan": item.hasil_pertemuan,
                "kesepakatan": item.kesepakatan,
                "dokumentasi_url": item.dokumentasi_url,
                "status": item.status,
            }
            for item in riwayat_pemanggilan_ortu
        ],
        "riwayat_home_visit": [
            {
                "id": item.id,
                "tanggal_kunjungan": item.tanggal_kunjungan,
                "alamat": item.alamat,
                "tujuan": item.tujuan,
                "hasil_observasi": item.hasil_observasi,
                "kesimpulan": item.kesimpulan,
                "foto_kunjungan_url": item.foto_kunjungan_url,
                "status": item.status,
            }
            for item in riwayat_home_visit
        ],
    }
    return SiswaProfileRead.model_validate(siswa_data)


def get_total_poin(db: Session, siswa_id: str) -> int:
    return get_total_poin_siswa(db, siswa_id)


def get_status_pembinaan(db: Session, siswa_id: str) -> str:
    total_poin = get_total_poin_siswa(db, siswa_id)
    return get_status_pembinaan_for_poin(total_poin)


def get_rekomendasi_sp_siswa(db: Session, siswa_id: str):
    total_poin = get_total_poin_siswa(db, siswa_id)
    return get_rekomendasi_sp(total_poin)
