import api from "./api";
import type { HomeVisit, HomeVisitCreatePayload, HomeVisitUpdatePayload } from "@/types/homeVisit";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getHomeVisitList(params?: { tanggal_awal?: string; tanggal_akhir?: string; siswa_id?: string; kelas_id?: string; status?: string }) {
  const response = await api.get<ApiResponse<HomeVisit[]>>("/home-visit", { params });
  return response.data.data ?? [];
}

export async function getHomeVisitById(id: string) {
  const response = await api.get<ApiResponse<HomeVisit>>(`/home-visit/${id}`);
  return response.data.data;
}

export async function getHomeVisitBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<HomeVisit[]>>(`/home-visit/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function createHomeVisit(payload: HomeVisitCreatePayload) {
  const response = await api.post<ApiResponse<HomeVisit>>("/home-visit", payload);
  return response.data.data;
}

export async function updateHomeVisit(id: string, payload: HomeVisitUpdatePayload) {
  const response = await api.put<ApiResponse<HomeVisit>>(`/home-visit/${id}`, payload);
  return response.data.data;
}

export async function deleteHomeVisit(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/home-visit/${id}`);
  return response.data.data;
}
