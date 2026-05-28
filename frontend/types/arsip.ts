export type Arsip = {
  id: string;
  tanggal: string;
  jenis_dokumen: string;
  siswa_id?: string | null;
  judul_dokumen: string;
  file_url?: string | null;
  keterangan?: string | null;
  uploaded_by: string;
  created_at?: string;
  updated_at?: string;
};
