import api from "./api";
import type { PemanggilanOrtu, PemanggilanOrtuCreatePayload, PemanggilanOrtuUpdatePayload } from "@/types/pemanggilanOrtu";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getPemanggilanOrtuList(params?: { tanggal_awal?: string; tanggal_akhir?: string; siswa_id?: string; kelas_id?: string; status?: string }) {
  const response = await api.get<ApiResponse<PemanggilanOrtu[]>>("/pemanggilan-ortu", { params });
  return response.data.data ?? [];
}

export async function getPemanggilanOrtuById(id: string) {
  const response = await api.get<ApiResponse<PemanggilanOrtu>>(`/pemanggilan-ortu/${id}`);
  return response.data.data;
}

export async function getPemanggilanOrtuBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<PemanggilanOrtu[]>>(`/pemanggilan-ortu/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function createPemanggilanOrtu(payload: PemanggilanOrtuCreatePayload) {
  const response = await api.post<ApiResponse<PemanggilanOrtu>>("/pemanggilan-ortu", payload);
  return response.data.data;
}

export async function updatePemanggilanOrtu(id: string, payload: PemanggilanOrtuUpdatePayload) {
  const response = await api.put<ApiResponse<PemanggilanOrtu>>(`/pemanggilan-ortu/${id}`, payload);
  return response.data.data;
}

export async function deletePemanggilanOrtu(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/pemanggilan-ortu/${id}`);
  return response.data.data;
}
