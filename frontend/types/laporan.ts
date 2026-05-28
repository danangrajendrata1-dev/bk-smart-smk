export type LaporanCard = {
  label: string;
  value: number | string;
  detail?: string | null;
};

export type LaporanSummary = {
  generated_at: string;
  cards: LaporanCard[];
  highlights: Record<string, number>;
};

export type LaporanItemPelanggaran = {
  id: string;
  tanggal_kejadian: string;
  siswa_id: string;
  kelas_id: string;
  master_pelanggaran_id: string;
  poin: number;
  status_tindak_lanjut: string;
  tindakan?: string | null;
};

export type LaporanItemPresensi = {
  id: string;
  tanggal: string;
  siswa_id: string;
  kelas_id: string;
  status: string;
  keterangan?: string | null;
};

export type LaporanItemKonseling = {
  id: string;
  tanggal: string;
  siswa_id: string;
  kelas_id: string;
  jenis_konseling: string;
  status: string;
  jadwal_berikutnya?: string | null;
};

export type LaporanItemSP = {
  id: string;
  nomor_surat: string;
  tanggal_sp: string;
  siswa_id: string;
  kelas_id: string;
  jenis_sp: string;
  total_poin: number;
  status_kirim_wa: string;
};

export type LaporanItemPemanggilanOrtu = {
  id: string;
  tanggal: string;
  siswa_id: string;
  kelas_id: string;
  status: string;
  alasan_pemanggilan: string;
};

export type LaporanItemHomeVisit = {
  id: string;
  tanggal_kunjungan: string;
  siswa_id: string;
  kelas_id: string;
  status: string;
  tujuan: string;
};
