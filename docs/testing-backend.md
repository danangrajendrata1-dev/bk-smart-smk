# Testing Backend BK SMART SMK

## 1. Cara Menjalankan Backend

Masuk ke folder backend lalu jalankan:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Pastikan file `backend/.env` sudah terisi minimal:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
JWT_SECRET_KEY=change_this_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000
APP_ENV=development
APP_NAME=BK SMART SMK
```

## 2. Cara Menjalankan Seed

Jalankan dari folder `backend`:

```bash
python seed.py
```

Seed ini idempotent, jadi aman dijalankan ulang tanpa membuat data ganda untuk data contoh utama.

## 3. Urutan Test Endpoint

1. Cek service hidup:
   - `GET /health`
2. Login admin default:
   - `POST /auth/login`
3. Simpan token JWT dari response.
4. Cek data kelas:
   - `GET /kelas`
5. Cek data siswa:
   - `GET /siswa`
6. Cek master pelanggaran:
   - `GET /master-pelanggaran`
7. Buat pelanggaran siswa:
   - `POST /pelanggaran`
8. Cek total poin siswa:
   - `GET /siswa/{id}/total-poin`
9. Cek status pembinaan siswa:
   - `GET /siswa/{id}/status-pembinaan`
10. Cek rekomendasi SP:
    - `GET /surat-peringatan/rekomendasi/{siswa_id}`
11. Buat konseling:
    - `POST /konseling`

## 4. Contoh Body JSON

### Login

```json
{
  "email": "admin@bksmart.local",
  "password": "admin12345"
}
```

### Create Kelas

```json
{
  "nama_kelas": "X TKJ 2",
  "tingkat": "X",
  "jurusan": "TKJ"
}
```

### Create Siswa

```json
{
  "nama_lengkap": "Budi Santoso",
  "nis": "240010",
  "nisn": "9988776601",
  "kelas_id": "<id_kelas>",
  "jurusan": "TKJ",
  "status_siswa": "aktif"
}
```

### Create Master Pelanggaran

```json
{
  "nama_pelanggaran": "Terlambat",
  "poin": 5,
  "kategori": "Disiplin"
}
```

### Create Pelanggaran

```json
{
  "siswa_id": "<id_siswa>",
  "master_pelanggaran_id": "<id_master_pelanggaran>",
  "tanggal": "2026-05-28",
  "catatan": "Datang terlambat 15 menit"
}
```

### Create Konseling

```json
{
  "siswa_id": "<id_siswa>",
  "jenis_konseling": "pribadi",
  "catatan_umum": "Siswa diajak refleksi",
  "catatan_rahasia": "Ada masalah keluarga",
  "tanggal": "2026-05-28"
}
```

### Cek Rekomendasi SP

Tidak perlu body. Gunakan:

```http
GET /surat-peringatan/rekomendasi/{siswa_id}
```

