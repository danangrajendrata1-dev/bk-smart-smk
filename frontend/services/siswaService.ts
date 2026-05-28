import api from "./api";
import type { Siswa, SiswaPayload, SiswaProfile } from "@/types/siswa";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getSiswa(params?: { search?: string; kelas_id?: string; status_siswa?: string }) {
  const response = await api.get<ApiResponse<Siswa[]>>("/siswa", { params });
  return response.data.data ?? [];
}

export async function getSiswaById(id: string) {
  const response = await api.get<ApiResponse<Siswa>>(`/siswa/${id}`);
  return response.data.data;
}

export async function getSiswaProfile(id: string) {
  const response = await api.get<ApiResponse<SiswaProfile>>(`/siswa/${id}/profile`);
  return response.data.data;
}

export async function getSiswaRekomendasiSp(id: string) {
  const response = await api.get<ApiResponse<{ siswa_id: string; rekomendasi_sp: string | null }>>(`/siswa/${id}/rekomendasi-sp`);
  return response.data.data;
}

export async function getSiswaTotalPoin(id: string) {
  const response = await api.get<ApiResponse<{ siswa_id: string; total_poin: number }>>(`/siswa/${id}/total-poin`);
  return response.data.data;
}

export async function getSiswaStatusPembinaan(id: string) {
  const response = await api.get<ApiResponse<{ siswa_id: string; status_pembinaan: string }>>(`/siswa/${id}/status-pembinaan`);
  return response.data.data;
}

export async function getRiwayatPelanggaranSiswa(id: string) {
  const response = await api.get<ApiResponse<Array<Record<string, unknown>>>>(`/pelanggaran/siswa/${id}`);
  return response.data.data ?? [];
}

export async function createSiswa(payload: SiswaPayload) {
  const response = await api.post<ApiResponse<Siswa>>("/siswa", payload);
  return response.data.data;
}

export async function updateSiswa(id: string, payload: Partial<SiswaPayload>) {
  const response = await api.put<ApiResponse<Siswa>>(`/siswa/${id}`, payload);
  return response.data.data;
}

export async function deleteSiswa(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/siswa/${id}`);
  return response.data.data;
}
