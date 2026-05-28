export type MasterPelanggaran = {
  id: string;
  jenis_pelanggaran: string;
  poin: number;
  kategori?: string | null;
  tindakan_default?: string | null;
  created_at?: string;
  updated_at?: string;
  status?: "aktif" | "nonaktif" | string | null;
};

export type MasterPelanggaranPayload = {
  jenis_pelanggaran: string;
  poin: number;
  kategori?: string | null;
  tindakan_default?: string | null;
  status?: string | null;
};
