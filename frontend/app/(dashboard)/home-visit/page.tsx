"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getHomeVisitList, deleteHomeVisit } from "@/services/homeVisitService";
import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import type { HomeVisit } from "@/types/homeVisit";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const [items, setItems] = useState<HomeVisit[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [filters, setFilters] = useState({ tanggal_awal: "", tanggal_akhir: "", siswa_id: "", kelas_id: "", status: "" });

  const load = async () => {
    setItems(await getHomeVisitList(filters));
    setSiswaItems(await getSiswa());
    setKelasItems(await getKelas());
  };

  useEffect(() => { void load(); }, [filters]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Home Visit</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola kunjungan rumah dan observasi lapangan.</p>
          </div>
          <Link href="/home-visit/create" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Tambah</Link>
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
                  <td className="px-4 py-3">{item.tanggal_kunjungan}</td>
                  <td className="px-4 py-3">{siswa?.nama_lengkap ?? "-"}</td>
                  <td className="px-4 py-3">{kelas?.nama_kelas ?? "-"}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Link href={`/home-visit/${item.id}`} className="rounded-lg border px-3 py-1">Detail</Link>
                    <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={async () => { await deleteHomeVisit(item.id); await load(); }}>Hapus</button>
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
