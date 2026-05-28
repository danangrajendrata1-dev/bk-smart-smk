import type { DaftarHadirKonseling } from "./daftarHadirKonseling";

export type Konseling = {
  id: string;
  tanggal: string;
  siswa_id: string;
  kelas_id: string;
  jenis_konseling: string;
  permasalahan: string;
  hasil_konseling?: string | null;
  tindak_lanjut?: string | null;
  jadwal_berikutnya?: string | null;
  konselor_id: string;
  catatan_rahasia?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  daftar_hadir?: DaftarHadirKonseling[];
};

export type KonselingCreatePayload = {
  tanggal: string;
  siswa_id: string;
  jenis_konseling: string;
  permasalahan: string;
  hasil_konseling?: string | null;
  tindak_lanjut?: string | null;
  jadwal_berikutnya?: string | null;
  catatan_rahasia?: string | null;
  status?: string | null;
};

export type KonselingUpdatePayload = Partial<KonselingCreatePayload>;
