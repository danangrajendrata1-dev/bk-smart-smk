# BK SMART SMK

BK SMART SMK adalah aplikasi web manajemen Bimbingan Konseling untuk SMK.

## Stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL Neon
- Deploy frontend: Vercel
- Deploy backend: Railway

## Menjalankan Lokal

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Pastikan `frontend/.env.local` berisi:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=BK SMART SMK
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Gunakan `backend/.env.example` sebagai referensi env lokal.

### Seed Data

```bash
cd backend
python -m app.seed.seed_data
```

Panduan seed ada di [docs/seed-data.md](docs/seed-data.md).

## Deployment

Panduan deploy lengkap ada di [docs/deployment.md](docs/deployment.md).

Ringkasnya:
- Backend deploy ke Railway dari folder `backend`
- Frontend deploy ke Vercel dari folder `frontend`
- Database pakai Neon PostgreSQL

## Struktur

```txt
bk-smart-smk/
├── frontend/
├── backend/
├── docs/
├── docker-compose.yml
└── README.md
```

## Catatan

- Semua API frontend harus lewat `process.env.NEXT_PUBLIC_API_URL`.
- Jangan commit file `.env` asli.
- Jangan hardcode URL backend atau database di source code.

