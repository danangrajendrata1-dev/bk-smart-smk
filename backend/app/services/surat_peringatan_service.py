from datetime import datetime
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.surat_peringatan_model import SuratPeringatan
from app.repositories.siswa_repository import get_siswa
from app.repositories.surat_peringatan_repository import (
    create_surat_peringatan as repo_create_sp,
    delete_surat_peringatan as repo_delete_sp,
    get_by_siswa_id as repo_get_by_siswa_id,
    get_existing_sp,
    get_last_by_type,
    get_surat_peringatan as repo_get_sp,
    list_surat_peringatan as repo_list_sp,
    update_surat_peringatan as repo_update_sp,
)
from app.schemas.arsip_schema import ArsipCreate
from app.schemas.surat_peringatan_schema import SuratPeringatanCreate, SuratPeringatanUpdate
from app.services.arsip_service import create_data as create_arsip_data
from app.services.pdf_service import generate_pdf_from_html
from app.services.pelanggaran_service import get_status_pembinaan_for_poin, get_total_poin_for_siswa
from app.services.whatsapp_service import build_wa_link
from app.utils.crud_helper import new_id, now_utc


def get_jenis_sp(total_poin: int):
    if total_poin < 50:
        return None
    if total_poin < 75:
        return "SP1"
    if total_poin < 100:
        return "SP2"
    return "SP3"


def generate_nomor_surat(db: Session, jenis_sp: str):
    bulan_romawi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][datetime.utcnow().month - 1]
    tahun = datetime.utcnow().year
    last = get_last_by_type(db, jenis_sp)
    urutan = 1
    if last and last.nomor_surat:
        try:
            urutan = int(last.nomor_surat.split("/")[-1]) + 1
        except Exception:
            urutan = 1
    return f"SP/{jenis_sp}/{bulan_romawi}/{tahun}/{urutan:04d}"


def check_duplicate_sp(db: Session, siswa_id: str, jenis_sp: str):
    return get_existing_sp(db, siswa_id, jenis_sp)


def list_data(db: Session, filters: dict | None = None):
    return repo_list_sp(db, filters)


def get_detail(db: Session, sp_id: str):
    sp = repo_get_sp(db, sp_id)
    if not sp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Surat peringatan tidak ditemukan")
    return sp


def get_rekomendasi(db: Session, siswa_id: str):
    siswa = get_siswa(db, siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")

    total_poin = get_total_poin_for_siswa(db, siswa_id)
    jenis_sp = get_jenis_sp(total_poin)
    riwayat = repo_get_by_siswa_id(db, siswa_id)
    if not jenis_sp:
        return {
            "siswa_id": siswa_id,
            "total_poin": total_poin,
            "status_pembinaan": get_status_pembinaan_for_poin(total_poin),
            "rekomendasi": None,
            "riwayat_surat_peringatan": [sp.nomor_surat for sp in riwayat],
        }

    existing = get_existing_sp(db, siswa_id, jenis_sp)
    return {
        "siswa_id": siswa_id,
        "total_poin": total_poin,
        "status_pembinaan": get_status_pembinaan_for_poin(total_poin),
        "rekomendasi": {
            "jenis_sp": jenis_sp,
            "sudah_ada": existing is not None,
        },
        "riwayat_surat_peringatan": [sp.nomor_surat for sp in riwayat],
    }


def create_data(db: Session, payload: SuratPeringatanCreate, current_user):
    siswa = get_siswa(db, payload.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")

    total_poin = get_total_poin_for_siswa(db, payload.siswa_id)
    if total_poin < 50:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Total poin belum memenuhi syarat SP")

    jenis_sp = get_jenis_sp(total_poin)
    if not jenis_sp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Jenis SP tidak valid")

    existing = get_existing_sp(db, payload.siswa_id, jenis_sp)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SP untuk siswa dan jenis yang sama sudah ada")

    nomor_surat = generate_nomor_surat(db, jenis_sp)

    sp = SuratPeringatan(
        id=new_id(),
        nomor_surat=nomor_surat,
        tanggal_sp=datetime.utcnow().strftime("%Y-%m-%d"),
        siswa_id=siswa.id,
        kelas_id=siswa.kelas_id,
        jenis_sp=jenis_sp,
        total_poin=total_poin,
        alasan_sp=payload.alasan_sp,
        tindakan=payload.tindakan,
        file_pdf_url=None,
        status_kirim_wa="belum",
        created_by=getattr(current_user, "id", ""),
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    return repo_create_sp(db, sp)


def create_arsip_from_sp(db: Session, sp: SuratPeringatan):
    siswa = get_siswa(db, sp.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")
    return create_arsip_data(
        db,
        ArsipCreate(
            tanggal=sp.tanggal_sp,
            jenis_dokumen="surat_peringatan",
            siswa_id=sp.siswa_id,
            judul_dokumen=f"Surat Peringatan {sp.nomor_surat}",
            file_url=f"/surat-peringatan/{sp.id}/download-pdf",
            keterangan=sp.alasan_sp,
        ),
        sp.created_by,
    )


def update_data(db: Session, sp_id: str, payload: SuratPeringatanUpdate):
    sp = get_detail(db, sp_id)
    data = payload.model_dump(exclude_unset=True)
    for field in ("alasan_sp", "tindakan", "status_kirim_wa"):
        if field in data:
            setattr(sp, field, data[field])
    sp.updated_at = now_utc()
    return repo_update_sp(db, sp)


def delete_data(db: Session, sp_id: str):
    sp = get_detail(db, sp_id)
    return repo_delete_sp(db, sp)


def generate_sp_pdf(db: Session, sp_id: str):
    sp = get_detail(db, sp_id)
    siswa = get_siswa(db, sp.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")

    template_path = Path("app/templates/surat_peringatan.html")
    html = template_path.read_text(encoding="utf-8")
    html = html.replace("{{ nomor_surat }}", sp.nomor_surat)
    html = html.replace("{{ tanggal }}", sp.tanggal_sp)
    html = html.replace("{{ nama_siswa }}", siswa.nama_lengkap)
    html = html.replace("{{ nis }}", siswa.nis)
    html = html.replace("{{ kelas }}", siswa.kelas_id)
    html = html.replace("{{ jurusan }}", siswa.jurusan or "-")
    html = html.replace("{{ total_poin }}", str(sp.total_poin))
    html = html.replace("{{ jenis_sp }}", sp.jenis_sp)
    html = html.replace("{{ alasan_sp }}", sp.alasan_sp)
    html = html.replace("{{ tindakan }}", sp.tindakan or "-")

    output_path = Path("generated/surat_peringatan") / f"{sp.nomor_surat.replace('/', '_')}.pdf"
    file_path = generate_pdf_from_html(html, str(output_path))
    sp.file_pdf_url = str(Path(file_path).as_posix())
    sp.updated_at = now_utc()
    repo_update_sp(db, sp)
    create_arsip_from_sp(db, sp)
    return sp


def build_whatsapp_link(db: Session, sp_id: str):
    sp = get_detail(db, sp_id)
    siswa = get_siswa(db, sp.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Siswa tidak ditemukan")
    pesan = (
        f"Yth. Bapak/Ibu Orang Tua/Wali dari {siswa.nama_lengkap},\n"
        f"Kami informasikan bahwa siswa tersebut mendapatkan {sp.jenis_sp} dengan total poin {sp.total_poin}.\n"
        "Mohon perhatian dan kerja samanya.\n"
        "Guru BK SMK"
    )
    return build_wa_link(siswa.no_wa_ortu, pesan)
