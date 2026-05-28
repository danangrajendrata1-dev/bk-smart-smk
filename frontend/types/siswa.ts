import type { Kelas } from "./kelas";
import type { Konseling } from "./konseling";
import type { DaftarHadirKonseling } from "./daftarHadirKonseling";

export type Siswa = {
  id: string;
  foto_url?: string | null;
  nama_lengkap: string;
  nis: string;
  nisn?: string | null;
  jenis_kelamin?: string | null;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  kelas_id: string;
  jurusan?: string | null;
  alamat?: string | null;
  no_hp_siswa?: string | null;
  nama_ortu?: string | null;
  no_wa_ortu?: string | null;
  status_siswa?: "aktif" | "nonaktif" | string | null;
  created_at?: string;
  updated_at?: string;
  kelas?: Kelas | null;
};

export type SiswaPayload = {
  foto_url?: string | null;
  nama_lengkap: string;
  nis: string;
  nisn?: string | null;
  jenis_kelamin?: string | null;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  kelas_id: string;
  jurusan?: string | null;
  alamat?: string | null;
  no_hp_siswa?: string | null;
  nama_ortu?: string | null;
  no_wa_ortu?: string | null;
  status_siswa?: "aktif" | "nonaktif" | string | null;
};

export type SiswaProfile = Siswa & {
  total_poin?: number;
  status_pembinaan?: string | null;
  rekomendasi_sp?: string | null;
  riwayat_pelanggaran?: Array<Record<string, unknown>>;
  riwayat_konseling?: Konseling[];
  jumlah_konseling?: number;
  jadwal_konseling_berikutnya?: string | null;
  riwayat_hadir_konseling?: DaftarHadirKonseling[];
  riwayat_surat_peringatan?: Array<{
    id: string;
    nomor_surat: string;
    tanggal_sp: string;
    jenis_sp: string;
    total_poin: number;
    alasan_sp: string;
    tindakan?: string | null;
    file_pdf_url?: string | null;
  }>;
  arsip_dokumen?: Array<{
    id: string;
    tanggal: string;
    jenis_dokumen: string;
    judul_dokumen: string;
    file_url?: string | null;
    keterangan?: string | null;
  }>;
  riwayat_pemanggilan_ortu?: Array<{
    id: string;
    tanggal: string;
    alasan_pemanggilan: string;
    hasil_pertemuan?: string | null;
    kesepakatan?: string | null;
    dokumentasi_url?: string | null;
    status: string;
  }>;
  riwayat_home_visit?: Array<{
    id: string;
    tanggal_kunjungan: string;
    alamat: string;
    tujuan: string;
    hasil_observasi?: string | null;
    kesimpulan?: string | null;
    foto_kunjungan_url?: string | null;
    status: string;
  }>;
};
