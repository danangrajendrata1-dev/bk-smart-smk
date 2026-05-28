# Seed Data BK SMART SMK

## Cara Menjalankan Seed

Dari folder `backend`, jalankan:

```bash
python -m app.seed.seed_data
```

## Data Default yang Dibuat

- User admin default:
  - Nama: `Admin BK`
  - Email: `admin@bksmart.local`
  - Password: `admin12345`
  - Role: `admin`
  - Status: `aktif`
- Kelas contoh:
  - `X TKJ 1`
  - `X TKJ 2`
  - `XI RPL 1`
  - `XII TKR 1`
- Master pelanggaran default:
  - `Terlambat` = `5`
  - `Rambut panjang` = `10`
  - `Bolos` = `25`
  - `Merokok` = `50`
  - `Berkelahi` = `75`

## Login Admin Default

- Email: `admin@bksmart.local`
- Password: `admin12345`

## Catatan Production

Password admin default wajib diganti saat production berjalan.
Jangan gunakan kredensial seed ini untuk lingkungan produksi.
