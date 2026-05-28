export type Pelanggaran = {
  id: string;
  tanggal_kejadian: string;
  siswa_id: string;
  kelas_id: string;
  master_pelanggaran_id: string;
  detail_pelanggaran?: string | null;
  poin: number;
  guru_pelapor_id: string;
  bukti_foto_url?: string | null;
  tindakan?: string | null;
  status_tindak_lanjut?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PelanggaranPayload = {
  tanggal_kejadian: string;
  siswa_id: string;
  master_pelanggaran_id: string;
  detail_pelanggaran?: string | null;
  bukti_foto_url?: string | null;
  tindakan?: string | null;
  status_tindak_lanjut?: string | null;
};
