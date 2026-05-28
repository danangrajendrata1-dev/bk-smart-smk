export const roleAccess = {
  admin: ["dashboard", "siswa", "kelas", "master_pelanggaran", "presensi", "pelanggaran", "konseling", "daftar_hadir_konseling", "surat_peringatan", "pemanggilan_ortu", "home_visit", "laporan", "arsip", "user_management", "settings"],
  guru_bk: ["dashboard", "siswa", "kelas", "master_pelanggaran", "presensi", "pelanggaran", "konseling", "daftar_hadir_konseling", "surat_peringatan", "pemanggilan_ortu", "home_visit", "laporan", "arsip", "settings"],
  wali_kelas: ["dashboard", "siswa", "presensi", "pelanggaran", "konseling", "laporan"],
  kesiswaan: ["dashboard", "presensi", "pelanggaran", "surat_peringatan", "laporan"],
  kepala_sekolah: ["dashboard", "laporan"],
};
