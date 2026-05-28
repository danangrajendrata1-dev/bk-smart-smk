export type Kelas = {
  id: string;
  nama_kelas: string;
  tingkat: string;
  jurusan: string;
  wali_kelas_id?: string | null;
  tahun_ajaran?: string | null;
  status?: "aktif" | "nonaktif" | string | null;
  created_at?: string;
  updated_at?: string;
};

export type KelasPayload = {
  nama_kelas: string;
  tingkat: string;
  jurusan: string;
  wali_kelas_id?: string | null;
  tahun_ajaran?: string | null;
  status?: string | null;
};
