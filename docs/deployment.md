# Deployment BK SMART SMK

## 1. Neon Database

1. Buat project database di Neon.
2. Salin connection string PostgreSQL yang disediakan Neon.
3. Gunakan string itu sebagai nilai `DATABASE_URL` di Railway.

## 2. Deploy Backend ke Railway

1. Buka Railway dan buat project baru.
2. Hubungkan repository BK SMART SMK.
3. Set root directory ke `backend`.
4. Tambahkan environment variable:
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
   - `JWT_ALGORITHM=HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES=1440`
   - `CORS_ORIGINS=https://domain-frontend.vercel.app`
   - `APP_ENV=production`
   - `APP_NAME=BK SMART SMK`
5. Pastikan start command memakai:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Setelah deploy, test endpoint:
   - `GET /health`

## 3. Deploy Frontend ke Vercel

1. Buka Vercel dan import repository yang sama.
2. Set root directory ke `frontend`.
3. Tambahkan environment variable:
   - `NEXT_PUBLIC_API_URL=https://domain-backend-railway.app`
   - `NEXT_PUBLIC_APP_NAME=BK SMART SMK`
4. Build command: `npm run build`
5. Deploy.

## 4. Hubungkan Frontend ke Backend

Pastikan `NEXT_PUBLIC_API_URL` di Vercel mengarah ke **public Railway URL** backend yang aktif, misalnya `https://nama-app.up.railway.app`.

Jangan isi dengan domain internal seperti `bk-smart-smk.railway.internal`, dan jangan isi tanpa protokol `https://`.

Semua request frontend harus lewat `process.env.NEXT_PUBLIC_API_URL`.

## 5. Test Login Online

1. Buka halaman `/login` dari frontend Vercel.
2. Login menggunakan akun admin seed atau akun produksi.
3. Pastikan redirect ke `/dashboard`.
4. Pastikan token tersimpan di browser.

## 6. Catatan Penting

- Jangan commit file `.env` asli.
- Gunakan `.env.example` sebagai panduan.
- Jika schema database berubah, buat migration Alembic.
