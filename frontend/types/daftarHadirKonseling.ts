export type DaftarHadirKonseling = {
  id: string;
  konseling_id: string;
  siswa_id: string;
  tanggal: string;
  waktu_hadir?: string | null;
  tanda_tangan_siswa?: string | null;
  status_hadir: "hadir" | "tidak_hadir" | "izin" | string;
  catatan?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export type DaftarHadirKonselingCreatePayload = {
  konseling_id: string;
  siswa_id?: string | null;
  tanggal?: string | null;
  waktu_hadir?: string | null;
  tanda_tangan_siswa?: string | null;
  status_hadir: "hadir" | "tidak_hadir" | "izin" | string;
  catatan?: string | null;
};

export type DaftarHadirKonselingUpdatePayload = Partial<DaftarHadirKonselingCreatePayload>;
