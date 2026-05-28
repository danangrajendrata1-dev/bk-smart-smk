import api from "./api";
import type { Kelas, KelasPayload } from "@/types/kelas";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getKelas() {
  const response = await api.get<ApiResponse<Kelas[]>>("/kelas");
  return response.data.data ?? [];
}

export async function getKelasById(id: string) {
  const response = await api.get<ApiResponse<Kelas>>(`/kelas/${id}`);
  return response.data.data;
}

export async function createKelas(payload: KelasPayload) {
  const response = await api.post<ApiResponse<Kelas>>("/kelas", payload);
  return response.data.data;
}

export async function updateKelas(id: string, payload: Partial<KelasPayload>) {
  const response = await api.put<ApiResponse<Kelas>>(`/kelas/${id}`, payload);
  return response.data.data;
}

export async function deleteKelas(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/kelas/${id}`);
  return response.data.data;
}
