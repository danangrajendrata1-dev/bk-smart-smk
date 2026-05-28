"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getKelas } from "@/services/kelasService";
import { deletePelanggaran, getPelanggaran } from "@/services/pelanggaranService";
import { getMasterPelanggaran } from "@/services/masterPelanggaranService";
import { getSiswa, getSiswaStatusPembinaan, getSiswaTotalPoin } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { MasterPelanggaran } from "@/types/masterPelanggaran";
import type { Pelanggaran } from "@/types/pelanggaran";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const [items, setItems] = useState<Pelanggaran[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [masterItems, setMasterItems] = useState<MasterPelanggaran[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterSiswa, setFilterSiswa] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [summary, setSummary] = useState<{ total_poin?: number; status_pembinaan?: string; rekomendasi_sp?: string | null }>({});

  const load = async () => {
    setItems(await getPelanggaran());
    setSiswaItems(await getSiswa());
    setKelasItems(await getKelas());
    setMasterItems(await getMasterPelanggaran());
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const siswa = siswaItems.find((s) => s.id === item.siswa_id);
    const matchDate = filterDate ? item.tanggal_kejadian === filterDate : true;
    const matchKelas = filterKelas ? siswa?.kelas_id === filterKelas : true;
    const matchSiswa = filterSiswa ? item.siswa_id === filterSiswa : true;
    const matchStatus = filterStatus ? item.status_tindak_lanjut === filterStatus : true;
    return matchDate && matchKelas && matchSiswa && matchStatus;
  }), [items, siswaItems, filterDate, filterKelas, filterSiswa, filterStatus]);

  const currentTotal = summary.total_poin ?? 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Pelanggaran</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola pelanggaran, poin, dan tindak lanjut siswa.</p>
          </div>
          <Link href="/pelanggaran/create" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Tambah Pelanggaran
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <input className="rounded-xl border px-4 py-3" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          <select className="rounded-xl border px-4 py-3" value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)}>
            <option value="">Filter kelas</option>
            {kelasItems.map((item) => <option key={item.id} value={item.id}>{item.nama_kelas}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filterSiswa} onChange={(e) => setFilterSiswa(e.target.value)}>
            <option value="">Filter siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Filter tindak lanjut</option>
            <option value="menunggu">Menunggu</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Siswa</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Poin</th>
              <th className="px-4 py-3">Guru Pelapor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.tanggal_kejadian}</td>
                <td className="px-4 py-3">{siswaItems.find((s) => s.id === item.siswa_id)?.nama_lengkap ?? "-"}</td>
                <td className="px-4 py-3">{kelasItems.find((k) => k.id === item.kelas_id)?.nama_kelas ?? "-"}</td>
                <td className="px-4 py-3">{masterItems.find((m) => m.id === item.master_pelanggaran_id)?.jenis_pelanggaran ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{item.poin}</span>
                </td>
                <td className="px-4 py-3">{item.guru_pelapor_id}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{item.status_tindak_lanjut ?? "-"}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="rounded-lg border px-3 py-1" onClick={async () => {
                    await deletePelanggaran(item.id);
                    await load();
                  }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Total poin terakhir: {currentTotal}</span>
          <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Status pembinaan: {summary.status_pembinaan ?? "-"}</span>
          <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Rekomendasi SP: {summary.rekomendasi_sp ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}
