"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { getKelas } from "@/services/kelasService";
import { getSiswa, getSiswaProfile } from "@/services/siswaService";
import { createSuratPeringatan, getRekomendasiSP } from "@/services/suratPeringatanService";
import type { Kelas } from "@/types/kelas";
import type { Siswa, SiswaProfile } from "@/types/siswa";
import type { SuratPeringatanCreatePayload, SuratPeringatanRecommendation } from "@/types/suratPeringatan";

const emptyForm: SuratPeringatanCreatePayload = { siswa_id: "", alasan_sp: "", tindakan: "" };

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SiswaProfile | null>(null);
  const [recommendation, setRecommendation] = useState<SuratPeringatanRecommendation | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    void Promise.all([getSiswa(), getKelas()]).then(([siswa, kelas]) => {
      setSiswaItems(siswa);
      setKelasItems(kelas);
    });
  }, [router]);

  useEffect(() => {
    const siswaId = searchParams.get("siswa_id");
    if (siswaId) {
      setForm((prev) => ({ ...prev, siswa_id: siswaId }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!form.siswa_id) {
      setSelectedProfile(null);
      setRecommendation(null);
      return;
    }
    void getSiswaProfile(form.siswa_id).then(setSelectedProfile);
    void getRekomendasiSP(form.siswa_id).then(setRecommendation);
  }, [form.siswa_id]);

  const siswa = useMemo(() => siswaItems.find((item) => item.id === form.siswa_id) ?? null, [siswaItems, form.siswa_id]);
  const kelas = kelasItems.find((item) => item.id === siswa?.kelas_id);
  const totalPoin = selectedProfile?.total_poin ?? 0;
  const rekomJenis = recommendation?.rekomendasi?.jenis_sp ?? selectedProfile?.rekomendasi_sp ?? "-";

  const handleSubmit = async () => {
    if (!form.siswa_id || !form.alasan_sp || !form.tindakan) {
      setError("Siswa, alasan SP, dan tindakan wajib diisi.");
      return;
    }
    if (totalPoin < 50) {
      setError("Total poin siswa belum memenuhi syarat untuk membuat SP.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await createSuratPeringatan(form);
      router.push(`/surat-peringatan/${created.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal membuat surat peringatan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Buat Surat Peringatan</h1>
        <p className="mt-1 text-sm text-slate-500">Pilih siswa, lalu sistem menampilkan rekomendasi SP dari total poin.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-xl border px-4 py-3" value={form.siswa_id} onChange={(e) => setForm({ ...form, siswa_id: e.target.value })}>
            <option value="">Pilih siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <input className="rounded-xl border px-4 py-3" value={kelas?.nama_kelas ?? "-"} disabled />
          <input className="rounded-xl border px-4 py-3" value={`${totalPoin}`} disabled />
          <input className="rounded-xl border px-4 py-3" value={rekomJenis} disabled />
          <input className="rounded-xl border px-4 py-3" placeholder="Alasan SP" value={form.alasan_sp} onChange={(e) => setForm({ ...form, alasan_sp: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" placeholder="Tindakan" value={form.tindakan} onChange={(e) => setForm({ ...form, tindakan: e.target.value })} />
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p><span className="text-slate-500">Status Pembinaan:</span> {selectedProfile?.status_pembinaan ?? "-"}</p>
          <p className="mt-1"><span className="text-slate-500">Nomor WA Ortu:</span> {siswa?.no_wa_ortu ?? "-"}</p>
        </div>

        {totalPoin < 50 ? (
          <p className="mt-4 text-sm text-amber-600">Total poin masih di bawah 50, surat peringatan belum bisa dibuat.</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          disabled={saving || totalPoin < 50}
          onClick={handleSubmit}
          className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Buat Surat Peringatan"}
        </button>
      </div>
    </div>
  );
}
