import api from "./apiClient";
import type { Pelanggaran, PelanggaranPayload } from "@/types/pelanggaran";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getPelanggaran() {
  const response = await api.get<ApiResponse<Pelanggaran[]>>("/pelanggaran");
  return response.data.data ?? [];
}

export async function getPelanggaranById(id: string) {
  const response = await api.get<ApiResponse<Pelanggaran>>(`/pelanggaran/${id}`);
  return response.data.data;
}

export async function getPelanggaranBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<Pelanggaran[]>>(`/pelanggaran/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function getPelanggaranByKelas(kelasId: string) {
  const response = await api.get<ApiResponse<Pelanggaran[]>>(`/pelanggaran?kelas_id=${kelasId}`);
  return response.data.data ?? [];
}

export async function createPelanggaran(payload: PelanggaranPayload) {
  const response = await api.post<ApiResponse<Pelanggaran>>("/pelanggaran", payload);
  return response.data.data;
}

export async function updatePelanggaran(id: string, payload: Partial<PelanggaranPayload>) {
  const response = await api.put<ApiResponse<Pelanggaran>>(`/pelanggaran/${id}`, payload);
  return response.data.data;
}

export async function deletePelanggaran(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/pelanggaran/${id}`);
  return response.data.data;
}
