export type Role = "admin" | "guru_bk" | "wali_kelas" | "kesiswaan" | "kepala_sekolah";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};
