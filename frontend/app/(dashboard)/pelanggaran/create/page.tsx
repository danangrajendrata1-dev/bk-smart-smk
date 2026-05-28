"use client";

import { useEffect, useMemo, useState } from "react";

import { createPelanggaran } from "@/services/pelanggaranService";
import { getMasterPelanggaran } from "@/services/masterPelanggaranService";
import { getSiswa, getSiswaStatusPembinaan, getSiswaTotalPoin } from "@/services/siswaService";
import { getKelas } from "@/services/kelasService";
import type { Kelas } from "@/types/kelas";
import type { MasterPelanggaran } from "@/types/masterPelanggaran";
import type { Siswa } from "@/types/siswa";

const emptyForm = { tanggal_kejadian: "", siswa_id: "", master_pelanggaran_id: "", detail_pelanggaran: "", bukti_foto_url: "", tindakan: "", status_tindak_lanjut: "menunggu" };

export default function Page() {
  const [form, setForm] = useState(emptyForm);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [masterItems, setMasterItems] = useState<MasterPelanggaran[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ total_poin?: number; status_pembinaan?: string; rekomendasi_sp?: string | null }>({});

  useEffect(() => {
    void getSiswa({ status_siswa: "aktif" }).then(setSiswaItems);
    void getKelas().then(setKelasItems);
    void getMasterPelanggaran().then(setMasterItems);
  }, []);

  const selectedSiswa = useMemo(() => siswaItems.find((item) => item.id === form.siswa_id), [siswaItems, form.siswa_id]);
  const selectedMaster = useMemo(() => masterItems.find((item) => item.id === form.master_pelanggaran_id), [masterItems, form.master_pelanggaran_id]);

  const onSubmit = async () => {
    setError("");
    try {
      const response: any = await createPelanggaran(form);
      setResult(response ?? {});
      if (form.siswa_id) {
        const total = await getSiswaTotalPoin(form.siswa_id);
        const status = await getSiswaStatusPembinaan(form.siswa_id);
        setResult((prev) => ({
          ...prev,
          total_poin: total.total_poin,
          status_pembinaan: status.status_pembinaan,
        }));
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Gagal menyimpan pelanggaran.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Pelanggaran</h1>
        <p className="mt-1 text-sm text-slate-500">Poin dan tindakan akan mengikuti master pelanggaran.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-xl border px-4 py-3" type="date" value={form.tanggal_kejadian} onChange={(e) => setForm({ ...form, tanggal_kejadian: e.target.value })} />
          <select className="rounded-xl border px-4 py-3" value={form.siswa_id} onChange={(e) => setForm({ ...form, siswa_id: e.target.value })}>
            <option value="">Pilih siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={form.master_pelanggaran_id} onChange={(e) => setForm({ ...form, master_pelanggaran_id: e.target.value, tindakan: selectedMaster?.tindakan_default ?? "" })}>
            <option value="">Pilih master pelanggaran</option>
            {masterItems.filter((item) => item.status !== "nonaktif").map((item) => <option key={item.id} value={item.id}>{item.jenis_pelanggaran} ({item.poin})</option>)}
          </select>
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Detail pelanggaran" value={form.detail_pelanggaran} onChange={(e) => setForm({ ...form, detail_pelanggaran: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" placeholder="Bukti foto URL" value={form.bukti_foto_url ?? ""} onChange={(e) => setForm({ ...form, bukti_foto_url: e.target.value })} />
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Tindakan" value={form.tindakan ?? ""} onChange={(e) => setForm({ ...form, tindakan: e.target.value })} />
          <select className="rounded-xl border px-4 py-3" value={form.status_tindak_lanjut ?? "menunggu"} onChange={(e) => setForm({ ...form, status_tindak_lanjut: e.target.value })}>
            <option value="menunggu">Menunggu</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
          <button onClick={onSubmit} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Simpan</button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-sm">Kelas siswa: <span className="font-semibold">{selectedSiswa ? kelasItems.find((k) => k.id === selectedSiswa.kelas_id)?.nama_kelas ?? "-" : "-"}</span></div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm">Poin otomatis: <span className="font-semibold">{selectedMaster?.poin ?? 0}</span></div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm">Tindakan default: <span className="font-semibold">{selectedMaster?.tindakan_default ?? "-"}</span></div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>

      {result.total_poin !== undefined ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Total poin terbaru: {result.total_poin}</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Status pembinaan: {result.status_pembinaan ?? "-"}</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Rekomendasi SP: {result.rekomendasi_sp ?? "-"}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
