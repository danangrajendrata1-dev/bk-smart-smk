import api from "./api";
import type {
  LaporanItemHomeVisit,
  LaporanItemKonseling,
  LaporanItemPelanggaran,
  LaporanItemPresensi,
  LaporanItemPemanggilanOrtu,
  LaporanItemSP,
  LaporanSummary,
} from "@/types/laporan";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getLaporanSummary() {
  const response = await api.get<ApiResponse<LaporanSummary>>("/laporan/summary");
  return response.data.data;
}

export async function getLaporanPelanggaran(params?: Record<string, string | undefined>) {
  const response = await api.get<ApiResponse<{ items: LaporanItemPelanggaran[]; total_kasus: number; total_poin: number }>>("/laporan/pelanggaran", { params });
  return response.data.data;
}

export async function getLaporanPresensi(params?: Record<string, string | undefined>) {
  const response = await api.get<ApiResponse<{ items: LaporanItemPresensi[]; jumlah_presensi: number; ringkasan: Record<string, number> }>>("/laporan/presensi", { params });
  return response.data.data;
}

export async function getLaporanKonseling(params?: Record<string, string | undefined>) {
  const response = await api.get<ApiResponse<{ items: LaporanItemKonseling[]; jumlah_konseling: number }>>("/laporan/konseling", { params });
  return response.data.data;
}

export async function getLaporanSuratPeringatan(params?: Record<string, string | undefined>) {
  const response = await api.get<ApiResponse<{ items: LaporanItemSP[]; ringkasan: Record<string, number> }>>("/laporan/surat-peringatan", { params });
  return response.data.data;
}

export async function getLaporanPemanggilanOrtu(params?: Record<string, string | undefined>) {
  const response = await api.get<ApiResponse<{ items: LaporanItemPemanggilanOrtu[]; jumlah_pemanggilan: number }>>("/laporan/pemanggilan-ortu", { params });
  return response.data.data;
}

export async function getLaporanHomeVisit(params?: Record<string, string | undefined>) {
  const response = await api.get<ApiResponse<{ items: LaporanItemHomeVisit[]; jumlah_home_visit: number }>>("/laporan/home-visit", { params });
  return response.data.data;
}
