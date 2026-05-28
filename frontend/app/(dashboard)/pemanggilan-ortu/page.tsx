"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getKelas } from "@/services/kelasService";
import { deletePemanggilanOrtu, getPemanggilanOrtuList } from "@/services/pemanggilanOrtuService";
import { getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { PemanggilanOrtu } from "@/types/pemanggilanOrtu";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const [items, setItems] = useState<PemanggilanOrtu[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [filters, setFilters] = useState({ tanggal_awal: "", tanggal_akhir: "", siswa_id: "", kelas_id: "", status: "" });

  const load = async () => {
    setItems(await getPemanggilanOrtuList(filters));
    setSiswaItems(await getSiswa());
    setKelasItems(await getKelas());
  };

  useEffect(() => { void load(); }, [filters]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Pemanggilan Orang Tua</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola panggilan dan hasil pertemuan dengan wali siswa.</p>
          </div>
          <Link href="/pemanggilan-ortu/create" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Tambah</Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          <input className="rounded-xl border px-4 py-3" type="date" value={filters.tanggal_awal} onChange={(e) => setFilters({ ...filters, tanggal_awal: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" type="date" value={filters.tanggal_akhir} onChange={(e) => setFilters({ ...filters, tanggal_akhir: e.target.value })} />
          <select className="rounded-xl border px-4 py-3" value={filters.siswa_id} onChange={(e) => setFilters({ ...filters, siswa_id: e.target.value })}>
            <option value="">Semua siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filters.kelas_id} onChange={(e) => setFilters({ ...filters, kelas_id: e.target.value })}>
            <option value="">Semua kelas</option>
            {kelasItems.map((item) => <option key={item.id} value={item.id}>{item.nama_kelas}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Semua status</option>
            <option value="dijadwalkan">Dijadwalkan</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const siswa = siswaItems.find((s) => s.id === item.siswa_id);
              const kelas = kelasItems.find((k) => k.id === item.kelas_id);
              return (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{siswa?.nama_lengkap ?? "-"}</td>
                  <td className="px-4 py-3">{kelas?.nama_kelas ?? "-"}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.status}</span></td>
                  <td className="px-4 py-3 space-x-2">
                    <Link href={`/pemanggilan-ortu/${item.id}`} className="rounded-lg border px-3 py-1">Detail</Link>
                    <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={async () => { await deletePemanggilanOrtu(item.id); await load(); }}>Hapus</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
