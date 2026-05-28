"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { getArsipList } from "@/services/arsipService";
import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import type { Arsip } from "@/types/arsip";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Page() {
  const [items, setItems] = useState<Arsip[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [filters, setFilters] = useState({ siswa_id: "", jenis_dokumen: "", tanggal_awal: "", tanggal_akhir: "" });

  useEffect(() => {
    void Promise.all([
      getArsipList(filters),
      getKelas(),
      getSiswa(),
    ]).then(([arsip, kelas, siswa]) => {
      setItems(arsip);
      setKelasItems(kelas);
      setSiswaItems(siswa);
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Arsip Dokumen</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select className="rounded-xl border px-4 py-3" value={filters.siswa_id} onChange={(e) => setFilters({ ...filters, siswa_id: e.target.value })}>
            <option value="">Semua siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filters.jenis_dokumen} onChange={(e) => setFilters({ ...filters, jenis_dokumen: e.target.value })}>
            <option value="">Semua jenis</option>
            {["surat_peringatan", "konseling", "presensi", "home_visit", "dokumen_siswa", "laporan"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input className="rounded-xl border px-4 py-3" type="date" value={filters.tanggal_awal} onChange={(e) => setFilters({ ...filters, tanggal_awal: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" type="date" value={filters.tanggal_akhir} onChange={(e) => setFilters({ ...filters, tanggal_akhir: e.target.value })} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Siswa</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">File</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const siswa = siswaItems.find((s) => s.id === item.siswa_id);
              const kelas = kelasItems.find((k) => k.id === siswa?.kelas_id);
              return (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.jenis_dokumen}</td>
                  <td className="px-4 py-3">{siswa?.nama_lengkap ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div>{item.judul_dokumen}</div>
                    <div className="text-xs text-slate-500">{kelas?.nama_kelas ?? "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    {item.file_url ? (
                      <a href={item.file_url.startsWith("http") ? item.file_url : `${apiUrl}${item.file_url}`} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1" target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                        Unduh
                      </a>
                    ) : (
                      "-"
                    )}
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
