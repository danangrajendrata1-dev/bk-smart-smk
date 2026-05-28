"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import SignaturePad from "@/components/ui/SignaturePad";
import { createDaftarHadirKonseling } from "@/services/daftarHadirKonselingService";
import { getKonselingList } from "@/services/konselingService";
import { getSiswa } from "@/services/siswaService";
import type { DaftarHadirKonselingCreatePayload } from "@/types/daftarHadirKonseling";
import type { Konseling } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

const initialForm: DaftarHadirKonselingCreatePayload = {
  konseling_id: "",
  siswa_id: "",
  tanggal: "",
  waktu_hadir: "",
  tanda_tangan_siswa: "",
  status_hadir: "hadir",
  catatan: "",
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<DaftarHadirKonselingCreatePayload>(initialForm);
  const [konselingItems, setKonselingItems] = useState<Konseling[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    void Promise.all([getKonselingList(), getSiswa()]).then(([konseling, siswa]) => {
      setKonselingItems(konseling);
      setSiswaItems(siswa);
    });
  }, [router]);

  useEffect(() => {
    const konselingId = searchParams.get("konseling_id");
    if (konselingId) {
      setForm((prev) => ({ ...prev, konseling_id: konselingId }));
    }
  }, [searchParams]);

  const selectedKonseling = useMemo(() => konselingItems.find((item) => item.id === form.konseling_id), [konselingItems, form.konseling_id]);
  const selectedSiswa = useMemo(() => siswaItems.find((item) => item.id === (form.siswa_id || selectedKonseling?.siswa_id)), [siswaItems, form.siswa_id, selectedKonseling?.siswa_id]);
  const selectedKelasName = selectedSiswa ? selectedSiswa.kelas?.nama_kelas ?? "-" : "-";

  useEffect(() => {
    if (selectedKonseling && !form.siswa_id) {
      setForm((prev) => ({ ...prev, siswa_id: selectedKonseling.siswa_id }));
    }
  }, [selectedKonseling, form.siswa_id]);

  const handleSubmit = async () => {
    if (!form.konseling_id || !form.status_hadir || !form.tanggal) {
      setError("Konseling, tanggal, dan status hadir wajib diisi.");
      return;
    }
    if (form.status_hadir === "hadir" && !form.tanda_tangan_siswa) {
      setError("Tanda tangan siswa wajib jika status hadir.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await createDaftarHadirKonseling({
        ...form,
        siswa_id: form.siswa_id || selectedKonseling?.siswa_id || undefined,
      });
      router.push(`/daftar-hadir-konseling/${result.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal menyimpan daftar hadir.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/daftar-hadir-konseling" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tambah Daftar Hadir Konseling</h1>
          <p className="mt-1 text-sm text-slate-500">Catat kehadiran dan tanda tangan digital siswa.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-xl border px-4 py-3" value={form.konseling_id} onChange={(e) => setForm({ ...form, konseling_id: e.target.value, siswa_id: "", tanda_tangan_siswa: "" })}>
            <option value="">Pilih konseling</option>
            {konselingItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.tanggal} - {siswaItems.find((s) => s.id === item.siswa_id)?.nama_lengkap ?? item.siswa_id}
              </option>
            ))}
          </select>
          <input className="rounded-xl border px-4 py-3" type="date" value={form.tanggal ?? ""} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
          <select className="rounded-xl border px-4 py-3" value={form.status_hadir} onChange={(e) => setForm({ ...form, status_hadir: e.target.value })}>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
            <option value="izin">Izin</option>
          </select>
          <input className="rounded-xl border px-4 py-3" placeholder="Waktu hadir (opsional)" value={form.waktu_hadir ?? ""} onChange={(e) => setForm({ ...form, waktu_hadir: e.target.value })} />
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Catatan" value={form.catatan ?? ""} onChange={(e) => setForm({ ...form, catatan: e.target.value })} />
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Siswa</p>
            <p className="font-medium">{selectedSiswa?.nama_lengkap ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Kelas</p>
            <p className="font-medium">{selectedKelasName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Status Hadir</p>
            <p className="font-medium">{form.status_hadir}</p>
          </div>
        </div>

        {form.status_hadir === "hadir" ? (
          <div className="mt-5">
            <SignaturePad
              value={form.tanda_tangan_siswa ?? ""}
              onChange={(value) => setForm({ ...form, tanda_tangan_siswa: value })}
            />
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Daftar Hadir"}
        </button>
      </div>
    </div>
  );
}
