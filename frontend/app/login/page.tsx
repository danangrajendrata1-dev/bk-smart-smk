"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { login } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await login({ email, password });
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("user", JSON.stringify(result.user));
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Email atau password tidak sesuai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_28%)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-7 w-7" />
              </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">BK SMART</h1>
                  <p className="text-sm text-slate-300">SMK Nasional</p>
                </div>
              </div>

            <div className="mt-14 max-w-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Sistem Manajemen Bimbingan Konseling</p>
              <h2 className="mt-5 text-5xl font-semibold leading-tight">Pusat kendali BK yang rapi, tenang, dan mudah dipakai guru.</h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                Kelola siswa, pelanggaran, konseling, dan tindak lanjut dengan alur kerja yang singkat dan konsisten.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-slate-300">Sistem ini dirancang untuk dipakai guru BK, wali kelas, dan kesiswaan dengan alur yang tenang dan rapi.</p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">BK SMART SMK</h1>
                  <p className="text-sm text-slate-500">Sistem Manajemen Bimbingan Konseling SMK</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Masukkan password"
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Masuk"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Belum punya akun?</span>
                <Link href="/register" className="font-medium text-slate-900 hover:underline">
                  Registrasi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
