import api from "./apiClient";
import type { MasterPelanggaran, MasterPelanggaranPayload } from "@/types/masterPelanggaran";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getMasterPelanggaran() {
  const response = await api.get<ApiResponse<MasterPelanggaran[]>>("/master-pelanggaran");
  return response.data.data ?? [];
}

export async function getMasterPelanggaranById(id: string) {
  const response = await api.get<ApiResponse<MasterPelanggaran>>(`/master-pelanggaran/${id}`);
  return response.data.data;
}

export async function createMasterPelanggaran(payload: MasterPelanggaranPayload) {
  const response = await api.post<ApiResponse<MasterPelanggaran>>("/master-pelanggaran", payload);
  return response.data.data;
}

export async function updateMasterPelanggaran(id: string, payload: Partial<MasterPelanggaranPayload>) {
  const response = await api.put<ApiResponse<MasterPelanggaran>>(`/master-pelanggaran/${id}`, payload);
  return response.data.data;
}

export async function deleteMasterPelanggaran(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/master-pelanggaran/${id}`);
  return response.data.data;
}
