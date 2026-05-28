import api, { getToken } from "./api";
import type { LoginRequest, LoginResponse, User } from "@/types/auth";

type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export async function login(payload: LoginRequest) {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function register(payload: {
  email: string;
  full_name: string;
  password: string;
  role: "admin" | "guru_bk" | "wali_kelas" | "kesiswaan" | "kepala_sekolah";
}) {
  const response = await api.post<ApiResponse<Record<string, unknown>>>("/auth/register", payload);
  return response.data.data;
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const response = await api.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
