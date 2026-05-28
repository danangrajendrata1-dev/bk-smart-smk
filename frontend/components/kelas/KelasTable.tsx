"use client";

import type { Kelas } from "@/types/kelas";

type Props = {
  items: Kelas[];
  onEdit: (item: Kelas) => void;
  onDelete: (item: Kelas) => void;
};

export default function KelasTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Nama Kelas</th>
            <th className="px-4 py-3">Tingkat</th>
            <th className="px-4 py-3">Jurusan</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-3">{item.nama_kelas}</td>
              <td className="px-4 py-3">{item.tingkat}</td>
              <td className="px-4 py-3">{item.jurusan}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs ${item.status === "nonaktif" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {item.status ?? "aktif"}
                </span>
              </td>
              <td className="px-4 py-3 space-x-2">
                <button className="rounded-lg border px-3 py-1" onClick={() => onEdit(item)}>Edit</button>
                <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={() => onDelete(item)}>Nonaktifkan</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
