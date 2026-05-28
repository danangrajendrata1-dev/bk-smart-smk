"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getDaftarHadirKonselingList, deleteDaftarHadirKonseling } from "@/services/daftarHadirKonselingService";
import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import type { DaftarHadirKonseling } from "@/types/daftarHadirKonseling";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

const statusOptions = ["hadir", "tidak_hadir", "izin"];

export default function Page() {
  const [items, setItems] = useState<DaftarHadirKonseling[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [filterSiswa, setFilterSiswa] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const load = async () => {
    setItems(await getDaftarHadirKonselingList({
      tanggal_awal: tanggalAwal || undefined,
      tanggal_akhir: tanggalAkhir || undefined,
      siswa_id: filterSiswa || undefined,
      status_hadir: filterStatus || undefined,
    }));
    setSiswaItems(await getSiswa());
    setKelasItems(await getKelas());
  };

  useEffect(() => {
    void load();
  }, [tanggalAwal, tanggalAkhir, filterSiswa, filterStatus]);

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Daftar Hadir Konseling</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola kehadiran konseling dan tanda tangan digital siswa.</p>
          </div>
          <Link href="/daftar-hadir-konseling/create" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Tambah Daftar Hadir
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <input className="rounded-xl border px-4 py-3" type="date" value={tanggalAwal} onChange={(e) => setTanggalAwal(e.target.value)} />
          <input className="rounded-xl border px-4 py-3" type="date" value={tanggalAkhir} onChange={(e) => setTanggalAkhir(e.target.value)} />
          <select className="rounded-xl border px-4 py-3" value={filterSiswa} onChange={(e) => setFilterSiswa(e.target.value)}>
            <option value="">Filter siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Filter status hadir</option>
            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
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
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Status Hadir</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.tanggal}</td>
                <td className="px-4 py-3">{siswaItems.find((s) => s.id === item.siswa_id)?.nama_lengkap ?? "-"}</td>
                <td className="px-4 py-3">{kelasItems.find((k) => k.id === siswaItems.find((s) => s.id === item.siswa_id)?.kelas_id)?.nama_kelas ?? "-"}</td>
                <td className="px-4 py-3">{item.waktu_hadir ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status_hadir === "hadir" ? "bg-emerald-100 text-emerald-700" : item.status_hadir === "izin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                  }`}>{item.status_hadir}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <Link href={`/daftar-hadir-konseling/${item.id}`} className="rounded-lg border px-3 py-1">Detail</Link>
                  <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={async () => { await deleteDaftarHadirKonseling(item.id); await load(); }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
