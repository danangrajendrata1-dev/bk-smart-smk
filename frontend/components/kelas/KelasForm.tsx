"use client";

import type { KelasPayload } from "@/types/kelas";

type Props = {
  value: KelasPayload;
  onChange: (value: KelasPayload) => void;
  onSubmit: () => void;
  submitLabel: string;
};

export default function KelasForm({ value, onChange, onSubmit, submitLabel }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <input className="rounded-xl border px-4 py-3" placeholder="Nama kelas" value={value.nama_kelas} onChange={(e) => onChange({ ...value, nama_kelas: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="Tingkat" value={value.tingkat} onChange={(e) => onChange({ ...value, tingkat: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="Jurusan" value={value.jurusan} onChange={(e) => onChange({ ...value, jurusan: e.target.value })} />
      <button className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={onSubmit}>{submitLabel}</button>
    </div>
  );
}
