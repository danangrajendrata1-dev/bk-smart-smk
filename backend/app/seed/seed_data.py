from datetime import datetime
from pathlib import Path
from uuid import uuid4
import sys

BASE_DIR = Path(__file__).resolve().parents[2]
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models import Kelas, MasterPelanggaran, User  # noqa: E402


def upsert_user(db, *, email: str, full_name: str, password: str, role: str, status: str = "aktif"):
    now = datetime.utcnow()
    user = db.query(User).filter(User.email == email.lower()).first()
    if user:
        user.full_name = full_name
        user.role = role
        user.status = status
        user.hashed_password = hash_password(password)
        user.updated_at = now
        return user

    user = User(
        id=str(uuid4()),
        email=email.lower(),
        full_name=full_name,
        role=role,
        status=status,
        hashed_password=hash_password(password),
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    return user


def upsert_kelas(db, *, nama_kelas: str, tingkat: str, jurusan: str):
    now = datetime.utcnow()
    kelas = db.query(Kelas).filter(Kelas.nama_kelas == nama_kelas).first()
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


def upsert_master_pelanggaran(db, *, jenis_pelanggaran: str, poin: int, kategori: str, tindakan_default: str):
    now = datetime.utcnow()
    item = db.query(MasterPelanggaran).filter(MasterPelanggaran.jenis_pelanggaran == jenis_pelanggaran).first()
    if item:
        item.poin = poin
        item.kategori = kategori
        item.tindakan_default = tindakan_default
        item.status = "aktif"
        item.updated_at = now
        return item

    item = MasterPelanggaran(
        id=str(uuid4()),
        jenis_pelanggaran=jenis_pelanggaran,
        poin=poin,
        kategori=kategori,
        tindakan_default=tindakan_default,
        status="aktif",
        created_at=now,
        updated_at=now,
    )
    db.add(item)
    return item


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        upsert_user(
            db,
            email="admin@bksmart.local",
            full_name="Admin BK",
            password="admin12345",
            role="admin",
            status="aktif",
        )

        upsert_kelas(db, nama_kelas="X TKJ 1", tingkat="X", jurusan="TKJ")
        upsert_kelas(db, nama_kelas="X TKJ 2", tingkat="X", jurusan="TKJ")
        upsert_kelas(db, nama_kelas="XI RPL 1", tingkat="XI", jurusan="RPL")
        upsert_kelas(db, nama_kelas="XII TKR 1", tingkat="XII", jurusan="TKR")

        upsert_master_pelanggaran(db, jenis_pelanggaran="Terlambat", poin=5, kategori="Disiplin", tindakan_default="Pembinaan dan peringatan")
        upsert_master_pelanggaran(db, jenis_pelanggaran="Rambut panjang", poin=10, kategori="Tata Tertib", tindakan_default="Peringatan lisan")
        upsert_master_pelanggaran(db, jenis_pelanggaran="Bolos", poin=25, kategori="Disiplin", tindakan_default="Panggilan wali")
        upsert_master_pelanggaran(db, jenis_pelanggaran="Merokok", poin=50, kategori="Disiplin Berat", tindakan_default="SP1")
        upsert_master_pelanggaran(db, jenis_pelanggaran="Berkelahi", poin=75, kategori="Disiplin Berat", tindakan_default="SP2")

        db.commit()
        print("Seed data backend BK SMART SMK selesai.")
        print("Admin default: admin@bksmart.local / admin12345")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
