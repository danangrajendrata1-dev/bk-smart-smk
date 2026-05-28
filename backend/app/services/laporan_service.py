from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from app.repositories.laporan_repository import (
    count_summary,
    list_home_visit,
    list_konseling,
    list_presensi,
    list_pelanggaran,
    list_pemanggilan_ortu,
    list_sp,
)
from app.utils.response import success_response


def get_summary(db: Session):
    summary = count_summary(db)
    cards = [
        {"label": "Total Pelanggaran", "value": summary["total_pelanggaran"], "detail": "Kasus aktif"},
        {"label": "Total Konseling", "value": summary["total_konseling"], "detail": "Catatan layanan"},
        {"label": "Total SP", "value": summary["total_sp"], "detail": "Surat peringatan"},
        {"label": "Pemanggilan Ortu", "value": summary["total_pemanggilan_ortu"], "detail": "Agenda orang tua"},
        {"label": "Home Visit", "value": summary["total_home_visit"], "detail": "Kunjungan rumah"},
        {"label": "Presensi", "value": summary["total_presensi"], "detail": "Catatan presensi"},
    ]
    return success_response(
        "Summary laporan berhasil diambil",
        {
            "generated_at": datetime.utcnow().isoformat(),
            "cards": cards,
            "highlights": summary,
        },
    )


def get_pelanggaran(db: Session, filters: dict | None = None):
    items = list_pelanggaran(db, filters)
    total_poin = sum(int(item.poin or 0) for item in items)
    return success_response(
        "Laporan pelanggaran berhasil diambil",
        {
            "items": [
                {
                    "id": item.id,
                    "tanggal_kejadian": item.tanggal_kejadian,
                    "siswa_id": item.siswa_id,
                    "kelas_id": item.kelas_id,
                    "master_pelanggaran_id": item.master_pelanggaran_id,
                    "poin": item.poin,
                    "status_tindak_lanjut": item.status_tindak_lanjut,
                    "tindakan": item.tindakan,
                }
                for item in items
            ],
            "total_kasus": len(items),
            "total_poin": total_poin,
        },
    )


def get_presensi(db: Session, filters: dict | None = None):
    items = list_presensi(db, filters)
    total_status = {}
    for item in items:
        key = item.status or "lainnya"
        total_status[key] = total_status.get(key, 0) + 1
    return success_response(
        "Laporan presensi berhasil diambil",
        {
            "items": [
                {
                    "id": item.id,
                    "tanggal": item.tanggal,
                    "siswa_id": item.siswa_id,
                    "kelas_id": item.kelas_id,
                    "status": item.status,
                    "keterangan": item.keterangan,
                }
                for item in items
            ],
            "jumlah_presensi": len(items),
            "ringkasan": total_status,
        },
    )


def get_konseling(db: Session, filters: dict | None = None):
    items = list_konseling(db, filters)
    return success_response(
        "Laporan konseling berhasil diambil",
        {
            "items": [
                {
                    "id": item.id,
                    "tanggal": item.tanggal,
                    "siswa_id": item.siswa_id,
                    "kelas_id": item.kelas_id,
                    "jenis_konseling": item.jenis_konseling,
                    "status": item.status,
                    "jadwal_berikutnya": item.jadwal_berikutnya,
                }
                for item in items
            ],
            "jumlah_konseling": len(items),
        },
    )


def get_surat_peringatan(db: Session, filters: dict | None = None):
    items = list_sp(db, filters)
    total = {"SP1": 0, "SP2": 0, "SP3": 0}
    for item in items:
        if item.jenis_sp in total:
            total[item.jenis_sp] += 1
    return success_response(
        "Laporan surat peringatan berhasil diambil",
        {
            "items": [
                {
                    "id": item.id,
                    "nomor_surat": item.nomor_surat,
                    "tanggal_sp": item.tanggal_sp,
                    "siswa_id": item.siswa_id,
                    "kelas_id": item.kelas_id,
                    "jenis_sp": item.jenis_sp,
                    "total_poin": item.total_poin,
                    "status_kirim_wa": item.status_kirim_wa,
                }
                for item in items
            ],
            "ringkasan": total,
        },
    )


def get_pemanggilan_ortu(db: Session, filters: dict | None = None):
    items = list_pemanggilan_ortu(db, filters)
    return success_response(
        "Laporan pemanggilan orang tua berhasil diambil",
        {
            "items": [
                {
                    "id": item.id,
                    "tanggal": item.tanggal,
                    "siswa_id": item.siswa_id,
                    "kelas_id": item.kelas_id,
                    "status": item.status,
                    "alasan_pemanggilan": item.alasan_pemanggilan,
                }
                for item in items
            ],
            "jumlah_pemanggilan": len(items),
        },
    )


def get_home_visit(db: Session, filters: dict | None = None):
    items = list_home_visit(db, filters)
    return success_response(
        "Laporan home visit berhasil diambil",
        {
            "items": [
                {
                    "id": item.id,
                    "tanggal_kunjungan": item.tanggal_kunjungan,
                    "siswa_id": item.siswa_id,
                    "kelas_id": item.kelas_id,
                    "status": item.status,
                    "tujuan": item.tujuan,
                }
                for item in items
            ],
            "jumlah_home_visit": len(items),
        },
    )
