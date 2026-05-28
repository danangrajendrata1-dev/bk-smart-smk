export type HomeVisit = {
  id: string;
  tanggal_kunjungan: string;
  siswa_id: string;
  kelas_id: string;
  alamat: string;
  tujuan: string;
  hasil_observasi?: string | null;
  kesimpulan?: string | null;
  foto_kunjungan_url?: string | null;
  tanda_tangan_ortu?: string | null;
  petugas_id: string;
  status: "dijadwalkan" | "selesai" | "dibatalkan" | string;
  created_at?: string;
  updated_at?: string;
};

export type HomeVisitCreatePayload = {
  tanggal_kunjungan?: string | null;
  siswa_id: string;
  alamat?: string | null;
  tujuan: string;
  hasil_observasi?: string | null;
  kesimpulan?: string | null;
  foto_kunjungan_url?: string | null;
  tanda_tangan_ortu?: string | null;
  status?: "dijadwalkan" | "selesai" | "dibatalkan" | string;
};

export type HomeVisitUpdatePayload = Partial<HomeVisitCreatePayload>;
