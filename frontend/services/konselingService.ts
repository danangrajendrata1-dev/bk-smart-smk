import api from "./api";
import type { Konseling, KonselingCreatePayload, KonselingUpdatePayload } from "@/types/konseling";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getKonselingList(params?: {
  tanggal_awal?: string;
  tanggal_akhir?: string;
  siswa_id?: string;
  kelas_id?: string;
  jenis_konseling?: string;
  status?: string;
}) {
  const response = await api.get<ApiResponse<Konseling[]>>("/konseling", { params });
  return response.data.data ?? [];
}

export async function getKonselingById(id: string) {
  const response = await api.get<ApiResponse<Konseling>>(`/konseling/${id}`);
  return response.data.data;
}

export async function getKonselingBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<Konseling[]>>(`/konseling/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function createKonseling(payload: KonselingCreatePayload) {
  const response = await api.post<ApiResponse<Konseling>>("/konseling", payload);
  return response.data.data;
}

export async function updateKonseling(id: string, payload: KonselingUpdatePayload) {
  const response = await api.put<ApiResponse<Konseling>>(`/konseling/${id}`, payload);
  return response.data.data;
}

export async function deleteKonseling(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/konseling/${id}`);
  return response.data.data;
}

export async function getJadwalKonselingHariIni() {
  const response = await api.get<ApiResponse<Konseling[]>>("/konseling/jadwal/hari-ini");
  return response.data.data ?? [];
}
