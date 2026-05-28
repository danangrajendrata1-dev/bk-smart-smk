import api from "./api";
import type { Arsip } from "@/types/arsip";

type ApiResponse<T> = { status: string; message: string; data: T };

export async function getArsipList(params?: {
  siswa_id?: string;
  jenis_dokumen?: string;
  tanggal_awal?: string;
  tanggal_akhir?: string;
}) {
  const response = await api.get<ApiResponse<Arsip[]>>("/arsip", { params });
  return response.data.data ?? [];
}

export async function getArsipById(id: string) {
  const response = await api.get<ApiResponse<Arsip>>(`/arsip/${id}`);
  return response.data.data;
}

export async function getArsipBySiswa(siswaId: string) {
  const response = await api.get<ApiResponse<Arsip[]>>(`/arsip/siswa/${siswaId}`);
  return response.data.data ?? [];
}

export async function getArsipByJenis(jenisDokumen: string) {
  const response = await api.get<ApiResponse<Arsip[]>>(`/arsip/jenis/${jenisDokumen}`);
  return response.data.data ?? [];
}
