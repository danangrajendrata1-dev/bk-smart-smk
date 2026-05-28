from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.pelanggaran_model import Pelanggaran
from app.repositories.kelas_repository import get_kelas
from app.repositories.master_pelanggaran_repository import get_master_pelanggaran
from app.repositories.pelanggaran_repository import (
    create_pelanggaran as repo_create_pelanggaran,
    delete_pelanggaran as repo_delete_pelanggaran,
    get_pelanggaran as repo_get_pelanggaran,
    list_pelanggaran as repo_list_pelanggaran,
    list_pelanggaran_by_siswa,
)
from app.repositories.siswa_repository import get_siswa
from app.schemas.pelanggaran_schema import PelanggaranCreate, PelanggaranUpdate
from app.utils.crud_helper import new_id, now_utc


def get_status_pembinaan(total_poin: int) -> str:
    if total_poin < 25:
        return "Aman"
    if total_poin < 50:
        return "Perhatian"
    if total_poin < 75:
        return "SP1"
    if total_poin < 100:
        return "SP2"
    return "SP3"


def get_rekomendasi_sp(total_poin: int):
    if total_poin < 50:
        return None
    if total_poin < 75:
        return "SP1"
    if total_poin < 100:
        return "SP2"
    return "SP3"


def get_total_poin_siswa(db: Session, siswa_id: str) -> int:
    return sum(item.poin or 0 for item in list_pelanggaran_by_siswa(db, siswa_id))


def get_status_pembinaan_for_poin(total_poin: int) -> str:
    return get_status_pembinaan(total_poin)


def get_total_poin_for_siswa(db: Session, siswa_id: str) -> int:
    return get_total_poin_siswa(db, siswa_id)


def list_data(db: Session):
    return repo_list_pelanggaran(db)


def get_detail(db: Session, pelanggaran_id: str):
    pelanggaran = repo_get_pelanggaran(db, pelanggaran_id)
    if not pelanggaran:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pelanggaran tidak ditemukan")
    return pelanggaran


def create_data(db: Session, payload: PelanggaranCreate, current_user):
    siswa = get_siswa(db, payload.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")

    master = get_master_pelanggaran(db, payload.master_pelanggaran_id)
    if not master or master.status != "aktif":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Master pelanggaran tidak aktif atau tidak ditemukan")

    kelas = get_kelas(db, siswa.kelas_id)
    if not kelas:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kelas siswa tidak valid")

    pelanggaran = Pelanggaran(
        id=new_id(),
        tanggal_kejadian=payload.tanggal_kejadian,
        siswa_id=siswa.id,
        kelas_id=kelas.id,
        master_pelanggaran_id=master.id,
        detail_pelanggaran=payload.detail_pelanggaran,
        poin=master.poin or 0,
        guru_pelapor_id=getattr(current_user, "id", ""),
        bukti_foto_url=payload.bukti_foto_url,
        tindakan=payload.tindakan or master.tindakan_default,
        status_tindak_lanjut=payload.status_tindak_lanjut or "menunggu",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    return repo_create_pelanggaran(db, pelanggaran)


def update_data(db: Session, pelanggaran_id: str, payload: PelanggaranUpdate):
    pelanggaran = get_detail(db, pelanggaran_id)
    data = payload.model_dump(exclude_unset=True)

    if "siswa_id" in data and data["siswa_id"]:
        siswa = get_siswa(db, data["siswa_id"])
        if not siswa:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")
        pelanggaran.siswa_id = siswa.id
        kelas = get_kelas(db, siswa.kelas_id)
        if kelas:
            pelanggaran.kelas_id = kelas.id

    if "master_pelanggaran_id" in data and data["master_pelanggaran_id"]:
        master = get_master_pelanggaran(db, data["master_pelanggaran_id"])
        if not master or master.status != "aktif":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Master pelanggaran tidak aktif atau tidak ditemukan")
        pelanggaran.master_pelanggaran_id = master.id
        pelanggaran.poin = master.poin or 0
        pelanggaran.tindakan = data.get("tindakan") or master.tindakan_default

    for field in ("tanggal_kejadian", "detail_pelanggaran", "bukti_foto_url", "tindakan", "status_tindak_lanjut"):
        if field in data:
            setattr(pelanggaran, field, data[field])

    pelanggaran.updated_at = now_utc()
    db.commit()
    db.refresh(pelanggaran)
    return pelanggaran


def delete_data(db: Session, pelanggaran_id: str):
    pelanggaran = get_detail(db, pelanggaran_id)
    return repo_delete_pelanggaran(db, pelanggaran)


def get_by_siswa(db: Session, siswa_id: str):
    return list_pelanggaran_by_siswa(db, siswa_id)
