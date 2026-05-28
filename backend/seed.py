from datetime import datetime
from pathlib import Path
import sys
from uuid import uuid4

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models import (  # noqa: E402,F401
    Kelas,
    MasterPelanggaran,
    Siswa,
    User,
)


def upsert_user(db, *, email: str, full_name: str, password: str, role: str, status: str = "aktif"):
    user = db.query(User).filter(User.email == email.lower()).first()
    now = datetime.utcnow()
    if user:
        user.full_name = full_name
        user.role = role
        user.status = status if hasattr(user, "status") else status
        if password:
            user.hashed_password = hash_password(password)
        user.updated_at = now
        return user

    user = User(
        id=str(uuid4()),
        email=email.lower(),
        full_name=full_name,
        role=role,
        hashed_password=hash_password(password),
        created_at=now,
        updated_at=now,
    )
    if hasattr(user, "status"):
        user.status = status
    db.add(user)
    return user


def upsert_kelas(db, *, nama_kelas: str, tingkat: str, jurusan: str):
    kelas = db.query(Kelas).filter(Kelas.nama_kelas == nama_kelas).first()
    now = datetime.utcnow()
    if kelas:
        kelas.tingkat = tingkat
        kelas.jurusan = jurusan
        kelas.updated_at = now
        return kelas

    kelas = Kelas(
        id=str(uuid4()),
        nama_kelas=nama_kelas,
        tingkat=tingkat,
        jurusan=jurusan,
        created_at=now,
        updated_at=now,
    )
    db.add(kelas)
    return kelas


def upsert_master_pelanggaran(db, *, nama_pelanggaran: str, poin: int, kategori: str):
    item = db.query(MasterPelanggaran).filter(MasterPelanggaran.nama_pelanggaran == nama_pelanggaran).first()
    now = datetime.utcnow()
    if item:
        item.poin = poin
        item.kategori = kategori
        item.updated_at = now
        return item

    item = MasterPelanggaran(
        id=str(uuid4()),
        nama_pelanggaran=nama_pelanggaran,
        poin=poin,
        kategori=kategori,
        created_at=now,
        updated_at=now,
    )
    db.add(item)
    return item


def upsert_siswa(db, *, nis: str, nama_lengkap: str, kelas_id: str, jurusan: str, nisn: str | None = None):
    siswa = db.query(Siswa).filter(Siswa.nis == nis).first()
    now = datetime.utcnow()
    if siswa:
        siswa.nama_lengkap = nama_lengkap
        siswa.kelas_id = kelas_id
        siswa.jurusan = jurusan
        siswa.nisn = nisn
        siswa.status_siswa = "aktif"
        siswa.updated_at = now
        return siswa

    siswa = Siswa(
        id=str(uuid4()),
        nama_lengkap=nama_lengkap,
        nis=nis,
        nisn=nisn,
        kelas_id=kelas_id,
        jurusan=jurusan,
        status_siswa="aktif",
        created_at=now,
        updated_at=now,
    )
    db.add(siswa)
    return siswa


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = upsert_user(
            db,
            email="admin@bksmart.local",
            full_name="Admin BK",
            password="admin12345",
            role="admin",
            status="aktif",
        )

        kelas_x = upsert_kelas(db, nama_kelas="X TKJ 1", tingkat="X", jurusan="TKJ")
        kelas_xii = upsert_kelas(db, nama_kelas="XII AKL 1", tingkat="XII", jurusan="AKL")

        upsert_master_pelanggaran(db, nama_pelanggaran="Terlambat", poin=5, kategori="Disiplin")
        upsert_master_pelanggaran(db, nama_pelanggaran="Rambut panjang", poin=10, kategori="Tata Tertib")
        upsert_master_pelanggaran(db, nama_pelanggaran="Bolos", poin=25, kategori="Disiplin")
        upsert_master_pelanggaran(db, nama_pelanggaran="Merokok", poin=50, kategori="Disiplin Berat")
        upsert_master_pelanggaran(db, nama_pelanggaran="Berkelahi", poin=75, kategori="Disiplin Berat")

        upsert_siswa(
            db,
            nis="240001",
            nama_lengkap="Andi Pratama",
            kelas_id=kelas_x.id,
            jurusan="TKJ",
            nisn="9988776655",
        )
        upsert_siswa(
            db,
            nis="240002",
            nama_lengkap="Siti Aisyah",
            kelas_id=kelas_xii.id,
            jurusan="AKL",
            nisn="9988776656",
        )

        db.commit()
        print("Seed backend BK SMART SMK selesai.")
        print("Admin default: admin@bksmart.local / admin12345")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
