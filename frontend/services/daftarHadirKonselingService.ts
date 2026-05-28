import api from "./api";
import type {
  DaftarHadirKonseling,
  DaftarHadirKonselingCreatePayload,
  DaftarHadirKonselingUpdatePayload,
} from "@/types/daftarHadirKonseling";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getDaftarHadirKonselingList(params?: {
  tanggal_awal?: string;
  tanggal_akhir?: string;
  siswa_id?: string;
  konseling_id?: string;
  status_hadir?: string;
}) {
  const response = await api.get<ApiResponse<DaftarHadirKonseling[]>>("/daftar-hadir-konseling", { params });
  return response.data.data ?? [];
}

export async function getDaftarHadirKonselingById(id: string) {
  const response = await api.get<ApiResponse<DaftarHadirKonseling>>(`/daftar-hadir-konseling/${id}`);
  return response.data.data;
}

export async function getDaftarHadirByKonseling(konselingId: string) {
  const response = await api.get<ApiResponse<DaftarHadirKonseling[]>>(`/daftar-hadir-konseling/konseling/${konselingId}`);
  return response.data.data ?? [];
}

export async function getDaftarHadirBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<DaftarHadirKonseling[]>>(`/daftar-hadir-konseling/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function createDaftarHadirKonseling(payload: DaftarHadirKonselingCreatePayload) {
  const response = await api.post<ApiResponse<DaftarHadirKonseling>>("/daftar-hadir-konseling", payload);
  return response.data.data;
}

export async function updateDaftarHadirKonseling(id: string, payload: DaftarHadirKonselingUpdatePayload) {
  const response = await api.put<ApiResponse<DaftarHadirKonseling>>(`/daftar-hadir-konseling/${id}`, payload);
  return response.data.data;
}

export async function deleteDaftarHadirKonseling(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/daftar-hadir-konseling/${id}`);
  return response.data.data;
}
