"use client";

import Link from "next/link";

import type { Kelas } from "@/types/kelas";
import type { Konseling } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

type Props = {
  items: Konseling[];
  siswaItems: Siswa[];
  kelasItems: Kelas[];
  onEdit: (item: Konseling) => void;
  onDelete: (item: Konseling) => void;
};

export default function KonselingTable({ items, siswaItems, kelasItems, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Siswa</th>
            <th className="px-4 py-3">Kelas</th>
            <th className="px-4 py-3">Jenis</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.tanggal}</td>
              <td className="px-4 py-3">{siswaItems.find((s) => s.id === item.siswa_id)?.nama_lengkap ?? "-"}</td>
              <td className="px-4 py-3">{kelasItems.find((k) => k.id === item.kelas_id)?.nama_kelas ?? "-"}</td>
              <td className="px-4 py-3">{item.jenis_konseling}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{item.status}</span>
              </td>
              <td className="px-4 py-3 space-x-2">
                <Link href={`/konseling/${item.id}`} className="rounded-lg border px-3 py-1">Detail</Link>
                <button className="rounded-lg border px-3 py-1" onClick={() => onEdit(item)}>Edit</button>
                <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={() => onDelete(item)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
