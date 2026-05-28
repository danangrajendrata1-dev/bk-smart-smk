import type { DaftarHadirKonseling } from "./daftarHadirKonseling";

export type SuratPeringatan = {
  id: string;
  nomor_surat: string;
  tanggal_sp: string;
  siswa_id: string;
  kelas_id: string;
  jenis_sp: "SP1" | "SP2" | "SP3" | string;
  total_poin: number;
  alasan_sp: string;
  tindakan?: string | null;
  file_pdf_url?: string | null;
  status_kirim_wa: "belum" | "terkirim" | string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  daftar_hadir?: DaftarHadirKonseling[];
};

export type SuratPeringatanCreatePayload = {
  siswa_id: string;
  alasan_sp: string;
  tindakan: string;
};

export type SuratPeringatanUpdatePayload = Partial<Pick<SuratPeringatan, "alasan_sp" | "tindakan" | "status_kirim_wa">>;

export type SuratPeringatanRecommendation = {
  siswa_id: string;
  total_poin: number;
  status_pembinaan?: string | null;
  rekomendasi?: { jenis_sp: string; sudah_ada: boolean } | null;
  riwayat_surat_peringatan?: string[];
};
