"use client";

import { useEffect, useMemo, useState } from "react";

import { createPelanggaran } from "@/services/pelanggaranService";
import { getMasterPelanggaran } from "@/services/masterPelanggaranService";
import { getSiswa, getSiswaStatusPembinaan, getSiswaTotalPoin } from "@/services/siswaService";
import { getKelas } from "@/services/kelasService";
import type { Kelas } from "@/types/kelas";
import type { MasterPelanggaran } from "@/types/masterPelanggaran";
import type { Siswa } from "@/types/siswa";

const emptyForm = {
  tanggal_kejadian: "",
  siswa_id: "",
  master_pelanggaran_id: "",
  detail_pelanggaran: "",
  bukti_foto_url: "",
  tindakan: "",
  status_tindak_lanjut: "menunggu",
};

export default function Page() {
  const [form, setForm] = useState(emptyForm);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [masterItems, setMasterItems] = useState<MasterPelanggaran[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ total_poin?: number; status_pembinaan?: string; rekomendasi_sp?: string | null }>({});

  useEffect(() => {
    void getSiswa({ status_siswa: "aktif" }).then(setSiswaItems);
    void getKelas().then(setKelasItems);
    void getMasterPelanggaran().then(setMasterItems);
  }, []);

  const selectedSiswa = useMemo(() => siswaItems.find((item) => item.id === form.siswa_id), [siswaItems, form.siswa_id]);
  const selectedMaster = useMemo(() => masterItems.find((item) => item.id === form.master_pelanggaran_id), [masterItems, form.master_pelanggaran_id]);

  const submit = async () => {
    if (!form.tanggal_kejadian || !form.siswa_id || !form.master_pelanggaran_id) {
      setError("Tanggal, siswa, dan jenis pelanggaran wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createPelanggaran(form);
      if (form.siswa_id) {
        const total = await getSiswaTotalPoin(form.siswa_id);
        const status = await getSiswaStatusPembinaan(form.siswa_id);
      setResult({
        total_poin: total.total_poin,
        status_pembinaan: status.status_pembinaan,
      });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal menyimpan pelanggaran.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Pelanggaran</h1>
            <p className="mt-1 text-sm text-slate-500">Input pelanggaran siswa dengan alur yang ringkas.</p>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 lg:hidden">
            Form mobile
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Tanggal Kejadian</span>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" type="date" value={form.tanggal_kejadian} onChange={(e) => setForm({ ...form, tanggal_kejadian: e.target.value })} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Nama Siswa</span>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" value={form.siswa_id} onChange={(e) => setForm({ ...form, siswa_id: e.target.value })}>
              <option value="">Pilih siswa</option>
              {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Kelas</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              value={selectedSiswa ? kelasItems.find((k) => k.id === selectedSiswa.kelas_id)?.nama_kelas ?? "-" : "-"}
              disabled
            />
          </label>
          <label className="space-y-1 text-sm xl:col-span-1">
            <span className="font-medium text-slate-700">Jenis Pelanggaran</span>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" value={form.master_pelanggaran_id} onChange={(e) => setForm({ ...form, master_pelanggaran_id: e.target.value, tindakan: selectedMaster?.tindakan_default ?? "" })}>
              <option value="">Pilih master pelanggaran</option>
              {masterItems.filter((item) => item.status !== "nonaktif").map((item) => <option key={item.id} value={item.id}>{item.jenis_pelanggaran}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Detail Pelanggaran</span>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" placeholder="Rambut melebihi kerah dan tidak rapi" value={form.detail_pelanggaran} onChange={(e) => setForm({ ...form, detail_pelanggaran: e.target.value })} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Poin Pelanggaran</span>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" value={selectedMaster?.poin ?? 0} disabled />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Guru Pelapor</span>
            <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" value="Guru BK" disabled />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Tindakan</span>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" value={form.tindakan} onChange={(e) => setForm({ ...form, tindakan: e.target.value })}>
              <option value="">Pilih tindakan</option>
              <option value="Teguran">Teguran</option>
              <option value="Pembinaan">Pembinaan</option>
              <option value="Panggil Orang Tua">Panggil Orang Tua</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Bukti Foto</span>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" placeholder="URL foto" value={form.bukti_foto_url ?? ""} onChange={(e) => setForm({ ...form, bukti_foto_url: e.target.value })} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Status Tindak Lanjut</span>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400" value={form.status_tindak_lanjut ?? "menunggu"} onChange={(e) => setForm({ ...form, status_tindak_lanjut: e.target.value })}>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">Kelas siswa</p>
            <p className="mt-1 font-semibold text-slate-900">{selectedSiswa ? kelasItems.find((k) => k.id === selectedSiswa.kelas_id)?.nama_kelas ?? "-" : "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">Poin otomatis</p>
            <p className="mt-1 font-semibold text-slate-900">{selectedMaster?.poin ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">Tindakan default</p>
            <p className="mt-1 font-semibold text-slate-900">{selectedMaster?.tindakan_default ?? "-"}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={submit} disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Batal
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>

      {result.total_poin !== undefined ? (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-4 text-sm">
              <p className="text-blue-700">Total poin terbaru</p>
              <p className="mt-1 text-2xl font-semibold text-blue-900">{result.total_poin}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm">
              <p className="text-emerald-700">Status pembinaan</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-900">{result.status_pembinaan ?? "-"}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 text-sm">
              <p className="text-amber-700">Rekomendasi SP</p>
              <p className="mt-1 text-2xl font-semibold text-amber-900">{result.rekomendasi_sp ?? "-"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
