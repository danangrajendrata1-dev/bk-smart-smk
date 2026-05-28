"use client";

import type { Kelas } from "@/types/kelas";
import type { KonselingCreatePayload } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

type Props = {
  value: KonselingCreatePayload;
  siswaItems: Siswa[];
  kelasItems: Kelas[];
  onChange: (value: KonselingCreatePayload) => void;
  onSubmit: () => void;
  submitLabel: string;
  showPrivate?: boolean;
};

export default function KonselingForm({ value, siswaItems, kelasItems, onChange, onSubmit, submitLabel, showPrivate = true }: Props) {
  const selectedSiswa = siswaItems.find((item) => item.id === value.siswa_id);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <input className="rounded-xl border px-4 py-3" type="date" value={value.tanggal} onChange={(e) => onChange({ ...value, tanggal: e.target.value })} />
      <select className="rounded-xl border px-4 py-3" value={value.siswa_id} onChange={(e) => onChange({ ...value, siswa_id: e.target.value })}>
        <option value="">Pilih siswa</option>
        {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
      </select>
      <select className="rounded-xl border px-4 py-3" value={value.jenis_konseling} onChange={(e) => onChange({ ...value, jenis_konseling: e.target.value })}>
        <option value="">Pilih jenis</option>
        {["pribadi", "sosial", "belajar", "karier"].map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <input className="rounded-xl border px-4 py-3 md:col-span-3" placeholder="Permasalahan" value={value.permasalahan} onChange={(e) => onChange({ ...value, permasalahan: e.target.value })} />
      <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Hasil konseling" value={value.hasil_konseling ?? ""} onChange={(e) => onChange({ ...value, hasil_konseling: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="Tindak lanjut" value={value.tindak_lanjut ?? ""} onChange={(e) => onChange({ ...value, tindak_lanjut: e.target.value })} />
      <input className="rounded-xl border px-4 py-3" placeholder="Jadwal berikutnya" value={value.jadwal_berikutnya ?? ""} onChange={(e) => onChange({ ...value, jadwal_berikutnya: e.target.value })} />
      {showPrivate ? (
        <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Catatan rahasia" value={value.catatan_rahasia ?? ""} onChange={(e) => onChange({ ...value, catatan_rahasia: e.target.value })} />
      ) : (
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 md:col-span-2">Catatan rahasia disembunyikan untuk role ini.</div>
      )}
      <select className="rounded-xl border px-4 py-3" value={value.status ?? "terjadwal"} onChange={(e) => onChange({ ...value, status: e.target.value })}>
        <option value="terjadwal">Terjadwal</option>
        <option value="selesai">Selesai</option>
        <option value="dibatalkan">Dibatalkan</option>
      </select>
      <button className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={onSubmit}>{submitLabel}</button>

      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm md:col-span-3">
        Kelas siswa: <span className="font-semibold">{selectedSiswa ? kelasItems.find((k) => k.id === selectedSiswa.kelas_id)?.nama_kelas ?? "-" : "-"}</span>
      </div>
    </div>
  );
}
