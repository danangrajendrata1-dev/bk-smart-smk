"use client";

import Link from "next/link";

import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

type Props = {
  items: Siswa[];
  kelasItems: Kelas[];
  onDelete: (item: Siswa) => void;
};

export default function SiswaTable({ items, kelasItems, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">NIS</th>
            <th className="px-4 py-3">Kelas</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.nama_lengkap}</td>
              <td className="px-4 py-3">{item.nis}</td>
              <td className="px-4 py-3">
                <div>{kelasItems.find((kelas) => kelas.id === item.kelas_id)?.nama_kelas ?? "-"}</div>
                <div className="text-xs text-slate-500">{item.jurusan ?? "-"}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs ${item.status_siswa === "nonaktif" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {item.status_siswa ?? "aktif"}
                </span>
              </td>
              <td className="px-4 py-3 space-x-2">
                <Link href={`/siswa/${item.id}`} className="rounded-lg border px-3 py-1">Detail</Link>
                <Link href={`/siswa/${item.id}/edit`} className="rounded-lg border px-3 py-1">Edit</Link>
                <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={() => onDelete(item)}>Nonaktifkan</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
