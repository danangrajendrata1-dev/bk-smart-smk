export type PemanggilanOrtu = {
  id: string;
  tanggal: string;
  siswa_id: string;
  kelas_id: string;
  alasan_pemanggilan: string;
  hasil_pertemuan?: string | null;
  kesepakatan?: string | null;
  dokumentasi_url?: string | null;
  tanda_tangan_ortu?: string | null;
  petugas_id: string;
  status: "dijadwalkan" | "selesai" | "dibatalkan" | string;
  created_at?: string;
  updated_at?: string;
};

export type PemanggilanOrtuCreatePayload = {
  tanggal?: string | null;
  siswa_id: string;
  alasan_pemanggilan: string;
  hasil_pertemuan?: string | null;
  kesepakatan?: string | null;
  dokumentasi_url?: string | null;
  tanda_tangan_ortu?: string | null;
  status?: "dijadwalkan" | "selesai" | "dibatalkan" | string;
};

export type PemanggilanOrtuUpdatePayload = Partial<PemanggilanOrtuCreatePayload>;
