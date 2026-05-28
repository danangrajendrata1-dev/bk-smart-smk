"use client";

import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { register } from "@/services/authService";
import type { Role } from "@/types/auth";

const roleOptions: { value: Role; label: string }[] = [
  { value: "guru_bk", label: "Guru BK" },
  { value: "wali_kelas", label: "Wali Kelas" },
  { value: "kesiswaan", label: "Kesiswaan" },
  { value: "kepala_sekolah", label: "Kepala Sekolah" },
  { value: "admin", label: "Admin" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("guru_bk");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await register({ full_name: fullName, email, password, role });
      router.replace("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke login
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Registrasi</h1>
              <p className="text-sm text-slate-500">Buat akun awal BK SMART SMK.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Nama lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {roleOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button onClick={handleSubmit} disabled={loading} className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? "Menyimpan..." : "Daftar"}
          </button>
        </div>
      </div>
    </main>
  );
}
