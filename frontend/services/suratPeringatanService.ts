import api from "./api";
import type {
  SuratPeringatan,
  SuratPeringatanCreatePayload,
  SuratPeringatanRecommendation,
  SuratPeringatanUpdatePayload,
} from "@/types/suratPeringatan";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getSuratPeringatanList(params?: {
  siswa_id?: string;
  kelas_id?: string;
  jenis_sp?: string;
  tanggal_awal?: string;
  tanggal_akhir?: string;
}) {
  const response = await api.get<ApiResponse<SuratPeringatan[]>>("/surat-peringatan", { params });
  return response.data.data ?? [];
}

export async function getSuratPeringatanById(id: string) {
  const response = await api.get<ApiResponse<SuratPeringatan>>(`/surat-peringatan/${id}`);
  return response.data.data;
}

export async function getSuratPeringatanBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<SuratPeringatan[]>>(`/surat-peringatan/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function getRekomendasiSP(siswaId: string) {
  const response = await api.get<ApiResponse<SuratPeringatanRecommendation>>(`/surat-peringatan/rekomendasi/${siswaId}`);
  return response.data.data;
}

export async function createSuratPeringatan(payload: SuratPeringatanCreatePayload) {
  const response = await api.post<ApiResponse<SuratPeringatan>>("/surat-peringatan", payload);
  return response.data.data;
}

export async function updateSuratPeringatan(id: string, payload: SuratPeringatanUpdatePayload) {
  const response = await api.put<ApiResponse<SuratPeringatan>>(`/surat-peringatan/${id}`, payload);
  return response.data.data;
}

export async function generateSuratPeringatanPdf(id: string) {
  const response = await api.post<ApiResponse<SuratPeringatan>>(`/surat-peringatan/${id}/generate-pdf`);
  return response.data.data;
}

export async function downloadSuratPeringatanPdf(id: string) {
  const response = await api.get(`/surat-peringatan/${id}/download-pdf`, { responseType: "blob" });
  return response.data as Blob;
}

export async function deleteSuratPeringatan(id: string) {
  const response = await api.delete<ApiResponse<Record<string, never>>>(`/surat-peringatan/${id}`);
  return response.data.data;
}
