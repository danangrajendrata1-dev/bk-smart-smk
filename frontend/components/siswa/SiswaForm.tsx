"use client";

import type { Kelas } from "@/types/kelas";
import type { SiswaPayload } from "@/types/siswa";

type Props = {
  value: SiswaPayload;
  kelasItems: Kelas[];
  onChange: (value: SiswaPayload) => void;
  onSubmit: () => void;
  submitLabel: string;
};

export default function SiswaForm({ value, kelasItems, onChange, onSubmit, submitLabel }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <input className="rounded-xl border px-4 py-3" placeholder="Nama lengkap" value={value.nama_lengkap} onChange={(e) => onChange({ ...value, nama_lengkap: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="NIS" value={value.nis} onChange={(e) => onChange({ ...value, nis: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="NISN" value={value.nisn ?? ""} onChange={(e) => onChange({ ...value, nisn: e.target.value })} />
      <select className="rounded-xl border px-4 py-3" value={value.kelas_id} onChange={(e) => onChange({ ...value, kelas_id: e.target.value })}>
        <option value="">Pilih kelas</option>
        {kelasItems.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>)}
      </select>
      <input className="rounded-xl border px-4 py-3" placeholder="Jurusan" value={value.jurusan ?? ""} onChange={(e) => onChange({ ...value, jurusan: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="No HP Siswa" value={value.no_hp_siswa ?? ""} onChange={(e) => onChange({ ...value, no_hp_siswa: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="Nama Orang Tua" value={value.nama_ortu ?? ""} onChange={(e) => onChange({ ...value, nama_ortu: e.target.value })} />
      <button className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={onSubmit}>{submitLabel}</button>
    </div>
  );
}
