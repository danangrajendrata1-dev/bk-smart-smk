# AGENTS.md — BK SMART SMK

## Identitas Project

Project ini bernama BK SMART SMK.

BK SMART SMK adalah aplikasi web manajemen Bimbingan Konseling untuk SMK. Aplikasi ini digunakan oleh Guru BK, Wali Kelas, Kesiswaan, Kepala Sekolah, dan Admin untuk mengelola data siswa, presensi, pelanggaran, konseling, surat peringatan, pemanggilan orang tua, home visit, arsip dokumen, laporan, dan dashboard sekolah.

Stack utama:
- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL Neon
- Frontend deploy: Vercel
- Backend deploy: Railway
- Database deploy: Neon PostgreSQL

Project harus tetap bisa dikembangkan agar nanti dapat dipindahkan ke server lokal/LAN sekolah jika diperlukan. Jangan hardcode URL API, database, atau domain deployment.

---

## Struktur Project

Gunakan struktur utama berikut:

bk-smart-smk/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── lib/
│   └── middleware.ts
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── routers/
│   │   ├── utils/
│   │   └── templates/
│   ├── alembic/
│   ├── main.py
│   └── requirements.txt
│
├── docs/
├── README.md
├── docker-compose.yml
└── .gitignore

Jangan mengubah struktur besar tanpa alasan kuat.

---

## Aturan Penting

1. Jangan menghapus file tanpa konfirmasi.
2. Jangan rename folder besar tanpa konfirmasi.
3. Jangan mengubah nama project.
4. Jangan hardcode API URL.
5. Jangan hardcode DATABASE_URL.
6. Jangan menyimpan secret key di source code.
7. Semua konfigurasi harus lewat environment variable.
8. Jangan mengganti stack utama tanpa konfirmasi.
9. Jangan menghapus fitur yang sudah ada.
10. Jangan membuat ulang project dari nol jika hanya diminta memperbaiki bagian tertentu.
11. Jika ada bug, perbaiki bagian yang terkait saja.
12. Jika perlu refactor, lakukan secara bertahap dan aman.
13. Jika mengubah schema database, jelaskan alasannya dan buat migration.
14. Jangan mengubah UI menjadi terlalu ramai atau norak.
15. Tampilan harus modern, clean, profesional, calm, dan mudah dibaca guru sekolah.

---

## Environment Variable

Frontend menggunakan:

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_NAME=BK SMART SMK

Backend menggunakan:

DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=
APP_ENV=
APP_NAME=BK SMART SMK

Semua akses API frontend harus melalui NEXT_PUBLIC_API_URL.

Contoh salah:

const API_URL = "https://domain-railway.app";

Contoh benar:

const API_URL = process.env.NEXT_PUBLIC_API_URL;

---

## Role dan Hak Akses

Gunakan role berikut:

- admin
- guru_bk
- wali_kelas
- kesiswaan
- kepala_sekolah

Hak akses:

admin:
- akses semua fitur

guru_bk:
- dashboard
- data siswa
- presensi
- pelanggaran
- konseling
- daftar hadir konseling
- surat peringatan
- pemanggilan orang tua
- home visit
- arsip
- laporan

wali_kelas:
- dashboard terbatas
- data siswa kelas sendiri
- presensi kelas sendiri
- pelanggaran kelas sendiri
- konseling kelas sendiri
- laporan kelas sendiri

kesiswaan:
- dashboard
- presensi
- pelanggaran
- surat peringatan
- laporan

kepala_sekolah:
- dashboard
- laporan
- hanya baca data penting

Jangan membuat role baru tanpa konfirmasi.

---

## Modul Utama

Project harus memiliki modul:

1. Auth
2. Dashboard
3. User Management
4. Kelas
5. Siswa
6. Presensi
7. Master Pelanggaran
8. Pelanggaran
9. Konseling
10. Daftar Hadir Konseling
11. Surat Peringatan
12. Pemanggilan Orang Tua
13. Home Visit
14. Arsip Dokumen
15. Laporan
16. Settings

---

## Alur Sistem

Alur utama aplikasi:

Login
→ Dashboard
→ Kelola Data Siswa
→ Input Presensi / Pelanggaran / Konseling
→ Sistem menghitung total poin pelanggaran
→ Jika poin tinggi, sistem memberi rekomendasi SP
→ Guru BK generate Surat Peringatan PDF
→ Dokumen masuk Arsip
→ Laporan bisa export PDF / Excel

Jangan membalik alur ini tanpa konfirmasi.

---

## Database Utama

Gunakan tabel utama berikut:

- users
- kelas
- siswa
- presensi
- master_pelanggaran
- pelanggaran
- konseling
- daftar_hadir_konseling
- surat_peringatan
- pemanggilan_ortu
- home_visit
- arsip_dokumen
- log_aktivitas

Gunakan snake_case untuk nama tabel dan kolom database.

Gunakan UUID atau string ID yang konsisten sebagai primary key.

Setiap tabel utama sebaiknya memiliki:
- id
- created_at
- updated_at

Jika memungkinkan, jangan hapus data fisik. Gunakan status atau soft delete untuk data penting.

---

## Aturan Backend FastAPI

Backend harus rapi dan OOP-oriented.

Gunakan pemisahan:

models/
- definisi SQLAlchemy model

schemas/
- Pydantic schema request dan response

repositories/
- query database

services/
- logic bisnis

routers/
- endpoint API

core/
- config, database, security, permissions

utils/
- helper function

Jangan menaruh semua logic di router.

Router hanya menerima request, memanggil service, lalu mengembalikan response.

Business logic harus berada di service.

Query database kompleks sebaiknya berada di repository.

---

## Format Response API

Gunakan response konsisten:

{
  "status": "success",
  "message": "Berhasil",
  "data": {}
}

Untuk error:

{
  "status": "error",
  "message": "Pesan error",
  "detail": {}
}

Gunakan HTTP status code yang tepat.

---

## Auth dan Security

Gunakan JWT authentication.

Password harus di-hash.

Jangan menyimpan password plain text.

Setiap endpoint penting harus memeriksa user login.

Endpoint tertentu harus memeriksa role.

Contoh:
- user management hanya admin
- laporan bisa admin, guru_bk, kesiswaan, kepala_sekolah
- wali_kelas hanya bisa melihat data kelas sendiri
- catatan rahasia konseling hanya guru_bk dan admin

---

## Aturan Frontend Next.js

Gunakan App Router.

Gunakan TypeScript.

Gunakan Tailwind CSS.

Struktur route utama:

app/
├── login/
├── unauthorized/
└── (dashboard)/
    ├── dashboard/
    ├── siswa/
    ├── kelas/
    ├── presensi/
    ├── pelanggaran/
    ├── konseling/
    ├── daftar-hadir-konseling/
    ├── surat-peringatan/
    ├── pemanggilan-ortu/
    ├── home-visit/
    ├── arsip/
    ├── laporan/
    ├── user-management/
    └── settings/

Gunakan services/ untuk semua komunikasi API.

Jangan memanggil fetch API langsung berulang-ulang di banyak page jika bisa dibuat service.

Gunakan types/ untuk tipe data.

Gunakan components/ untuk komponen yang bisa dipakai ulang.

---

## Aturan UI

Desain aplikasi harus:
- modern
- clean
- profesional
- ringan
- mudah dibaca
- cocok untuk guru sekolah
- responsive untuk laptop dan HP

Warna utama:
- biru dongker
- putih
- abu muda

Gunakan:
- card modern
- shadow halus
- table rapi
- badge status
- tombol jelas
- sidebar konsisten
- form mudah dipahami

Jangan gunakan warna terlalu mencolok, neon, atau terlalu ramai.

---

## Sidebar

Sidebar harus berisi:

Dashboard

Master Data:
- Data Siswa
- Data Kelas
- Data User
- Master Pelanggaran

Aktivitas BK:
- Presensi
- Pelanggaran
- Konseling
- Daftar Hadir Konseling

Tindak Lanjut:
- Surat Peringatan
- Pemanggilan Orang Tua
- Home Visit

Dokumen:
- Arsip Dokumen
- Laporan

Sistem:
- Pengaturan
- Logout

Sidebar harus menampilkan menu sesuai role user.

---

## Mobile Navigation

Untuk tampilan mobile, gunakan navigasi yang sederhana:

- Dashboard
- Siswa
- Pelanggaran
- Konseling
- Lainnya

Menu lainnya menampilkan fitur tambahan.

---

## Aturan Data Siswa

Field utama siswa:
- foto_url
- nama_lengkap
- nis
- nisn
- jenis_kelamin
- tempat_lahir
- tanggal_lahir
- kelas_id
- jurusan
- alamat
- no_hp_siswa
- nama_ortu
- no_wa_ortu
- status_siswa

Fitur:
- tambah siswa
- edit siswa
- detail siswa
- filter kelas
- pencarian siswa
- riwayat pelanggaran
- riwayat konseling
- riwayat presensi

---

## Aturan Pelanggaran

master_pelanggaran harus menjadi sumber poin.

Data awal:
- Terlambat = 5
- Rambut panjang = 10
- Bolos = 25
- Merokok = 50
- Berkelahi = 75

Saat input pelanggaran:
1. pilih siswa
2. pilih jenis pelanggaran
3. sistem mengambil poin dari master_pelanggaran
4. simpan pelanggaran
5. total poin siswa dihitung dari seluruh pelanggaran
6. sistem menampilkan status pembinaan

Status pembinaan:
- 0 sampai 24 = Aman
- 25 sampai 49 = Perhatian
- 50 sampai 74 = SP1
- 75 sampai 99 = SP2
- 100 ke atas = SP3

Jangan menyimpan total_poin manual jika bisa dihitung dari tabel pelanggaran.

---

## Aturan Konseling

Jenis konseling:
- pribadi
- sosial
- belajar
- karier

Catatan rahasia hanya boleh diakses:
- admin
- guru_bk

Wali kelas tidak boleh melihat catatan rahasia konseling kecuali nanti diizinkan secara eksplisit.

---

## Aturan Presensi

Status presensi:
- hadir
- izin
- sakit
- alfa
- terlambat

Presensi harus bisa difilter berdasarkan:
- tanggal
- kelas
- status

---

## Aturan Surat Peringatan

Jenis SP:
- SP1
- SP2
- SP3

Aturan:
- 50 sampai 74 poin = SP1
- 75 sampai 99 poin = SP2
- 100 ke atas = SP3

Surat peringatan harus bisa:
- dibuat manual dari siswa
- direkomendasikan otomatis berdasarkan total poin
- generate PDF
- menyimpan file PDF ke arsip
- menampilkan tombol kirim WhatsApp jika nomor orang tua tersedia

PDF harus menggunakan template backend.

---

## Aturan Tanda Tangan Digital

Tanda tangan digital disimpan sebagai gambar.

Digunakan untuk:
- daftar hadir konseling
- tanda terima SP
- home visit
- pemanggilan orang tua

Frontend boleh memakai canvas signature pad.

Backend menerima file base64/image lalu menyimpan URL/path file.

---

## Aturan Laporan

Laporan utama:
- laporan presensi
- laporan pelanggaran
- laporan konseling
- laporan bulanan
- laporan siswa prioritas
- laporan surat peringatan

Laporan harus bisa difilter:
- tanggal awal
- tanggal akhir
- kelas
- siswa
- jenis laporan

Export:
- Excel
- PDF

---

## Aturan WhatsApp

Untuk awal, tombol WhatsApp cukup menggunakan link wa.me.

Jangan langsung mengintegrasikan WhatsApp API berbayar tanpa konfirmasi.

Format nomor harus dibersihkan dulu:
- hilangkan spasi
- hilangkan tanda -
- ubah awalan 0 menjadi 62

---

## Testing dan Validasi

Setiap selesai mengubah frontend:
- jalankan npm run lint jika tersedia
- jalankan npm run build jika memungkinkan

Setiap selesai mengubah backend:
- jalankan python -m compileall app
- jalankan test jika tersedia
- pastikan import tidak error

Sebelum menyatakan selesai:
- jelaskan file apa saja yang diubah
- jelaskan fitur/bug yang diperbaiki
- jelaskan cara mengetesnya
- pastikan tidak ada hardcoded URL
- pastikan tidak ada secret key di repo

---

## Git Rules

Sebelum commit:
1. cek perubahan
2. pastikan tidak ada file .env asli
3. pastikan tidak ada secret
4. pastikan build/lint aman jika memungkinkan
5. buat commit message yang jelas

Format commit message:
- feat: add siswa module
- fix: repair login token handling
- refactor: clean pelanggaran service
- docs: update deployment guide

Jangan push ke main tanpa diminta user.

Jika user meminta push, pastikan semua perubahan sudah dicek.

---

## Deployment Rules

Frontend Vercel:
- root directory: frontend
- env: NEXT_PUBLIC_API_URL
- build command: npm run build

Backend Railway:
- root directory: backend
- env: DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS
- start command menyesuaikan Procfile atau railway.json

Database Neon:
- gunakan DATABASE_URL dari Neon
- jangan hardcode di source code
- gunakan migration jika schema berubah

---

## Done Definition

Pekerjaan dianggap selesai jika:
1. fitur berjalan sesuai permintaan
2. tidak merusak fitur lama
3. struktur project tetap rapi
4. role access tetap aman
5. frontend tidak hardcode URL
6. backend tidak hardcode database
7. file yang diubah dijelaskan
8. cara test dijelaskan
9. jika ada hal yang belum selesai, tulis dengan jujur

---

## Instruksi Khusus untuk Codex

Saat menerima tugas:
1. baca struktur project terlebih dahulu
2. pahami file terkait sebelum mengubah
3. jangan langsung rewrite seluruh project
4. ubah hanya file yang diperlukan
5. jika ada error TypeScript/Python, perbaiki sampai aman
6. jika ada konflik struktur, ikuti AGENTS.md ini
7. jika ada keputusan besar, minta konfirmasi
8. jika user meminta "final coding", berikan file lengkap yang sudah final
9. jika user meminta "push GitHub", cek perubahan dan commit dengan pesan jelas
10. jika user meminta "buat modul baru", buat frontend, backend, schema, model, service, router, dan dokumentasi minimal bila diperlukan