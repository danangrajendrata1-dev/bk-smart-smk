"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import KonselingForm from "@/components/konseling/KonselingForm";
import { getKelas } from "@/services/kelasService";
import { createKonseling } from "@/services/konselingService";
import { getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { KonselingCreatePayload } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

const initialValue: KonselingCreatePayload = {
  tanggal: "",
  siswa_id: "",
  jenis_konseling: "",
  permasalahan: "",
  hasil_konseling: "",
  tindak_lanjut: "",
  jadwal_berikutnya: "",
  catatan_rahasia: "",
  status: "terjadwal",
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<KonselingCreatePayload>(initialValue);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        setRole(JSON.parse(rawUser).role || "");
      } catch {
        setRole("");
      }
    }

    const siswaId = searchParams.get("siswa_id");
    if (siswaId) {
      setValue((prev) => ({ ...prev, siswa_id: siswaId }));
    }

    void Promise.all([getSiswa(), getKelas()]).then(([siswa, kelas]) => {
      setSiswaItems(siswa);
      setKelasItems(kelas);
    });
  }, [router, searchParams]);

  const selectedSiswa = useMemo(() => siswaItems.find((item) => item.id === value.siswa_id), [siswaItems, value.siswa_id]);
  const selectedKelas = useMemo(() => kelasItems.find((item) => item.id === selectedSiswa?.kelas_id), [kelasItems, selectedSiswa?.kelas_id]);

  const handleSubmit = async () => {
    if (!value.tanggal || !value.siswa_id || !value.jenis_konseling || !value.permasalahan) {
      setError("Tanggal, siswa, jenis konseling, dan permasalahan wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await createKonseling(value);
      setSuccess("Konseling berhasil disimpan.");
      setValue(initialValue);
      router.push(`/konseling/${result.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal menyimpan konseling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/konseling" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tambah Konseling</h1>
          <p className="mt-1 text-sm text-slate-500">Catat proses konseling siswa dengan rapi dan aman.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

        <KonselingForm
          value={value}
          siswaItems={siswaItems}
          kelasItems={kelasItems}
          onChange={setValue}
          onSubmit={handleSubmit}
          submitLabel={loading ? "Menyimpan..." : "Simpan Konseling"}
          showPrivate={["admin", "guru_bk"].includes(role)}
        />

        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Siswa Terpilih</p>
            <p className="font-medium">{selectedSiswa?.nama_lengkap ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Kelas</p>
            <p className="font-medium">{selectedKelas?.nama_kelas ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Konselor</p>
            <p className="font-medium">Otomatis dari user login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
