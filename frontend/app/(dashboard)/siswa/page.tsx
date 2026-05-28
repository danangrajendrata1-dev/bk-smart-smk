"use client";

import { useEffect, useState } from "react";

import SiswaTable from "@/components/siswa/SiswaTable";
import { getKelas } from "@/services/kelasService";
import { deleteSiswa, getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";
import Link from "next/link";

export default function Page() {
  const [items, setItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setItems(await getSiswa({
      search: search || undefined,
      kelas_id: kelasFilter || undefined,
      status_siswa: statusFilter || undefined,
    }));
    setKelasItems(await getKelas());
  };

  useEffect(() => { void load(); }, [search, kelasFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Data Siswa</h1>
            <p className="mt-1 text-sm text-slate-500">Cari, filter, dan kelola data siswa.</p>
          </div>
          <Link href="/siswa/create" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Tambah Siswa
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <input className="rounded-xl border px-4 py-3" placeholder="Cari nama / NIS" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="rounded-xl border px-4 py-3" value={kelasFilter} onChange={(e) => setKelasFilter(e.target.value)}>
            <option value="">Semua kelas</option>
            {kelasItems.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      <SiswaTable
        items={items}
        kelasItems={kelasItems}
        onDelete={async (item) => {
          await deleteSiswa(item.id);
          await load();
        }}
      />
    </div>
  );
}
