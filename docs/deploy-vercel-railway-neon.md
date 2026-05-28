# Deployment

## Neon

1. Buat project PostgreSQL di Neon.
2. Ambil `DATABASE_URL`.

## Railway

1. Deploy folder `backend`.
2. Masukkan env `DATABASE_URL`, `JWT_SECRET_KEY`, dan `CORS_ORIGINS`.

## Vercel

1. Deploy folder `frontend`.
2. Masukkan env `NEXT_PUBLIC_API_URL` ke URL backend Railway.
