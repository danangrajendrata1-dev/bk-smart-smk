"use client";

import type { Konseling } from "@/types/konseling";
import type { DaftarHadirKonseling } from "@/types/daftarHadirKonseling";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

type Props = {
  item: Konseling | null;
  siswaItems: Siswa[];
  kelasItems: Kelas[];
  showPrivate: boolean;
};

export default function KonselingDetailCard({ item, siswaItems, kelasItems, showPrivate }: Props) {
  if (!item) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500">Klik detail untuk melihat data konseling.</div>;
  }

  const siswa = siswaItems.find((data) => data.id === item.siswa_id);
  const kelas = kelasItems.find((data) => data.id === item.kelas_id);
  const daftarHadir = (item.daftar_hadir ?? []) as DaftarHadirKonseling[];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Detail Konseling</h2>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div><span className="text-slate-500">Siswa:</span> {siswa?.nama_lengkap ?? "-"}</div>
        <div><span className="text-slate-500">Kelas:</span> {kelas?.nama_kelas ?? "-"}</div>
        <div><span className="text-slate-500">Tanggal:</span> {item.tanggal}</div>
        <div><span className="text-slate-500">Jenis:</span> {item.jenis_konseling}</div>
        <div><span className="text-slate-500">Permasalahan:</span> {item.permasalahan}</div>
        <div><span className="text-slate-500">Hasil:</span> {item.hasil_konseling ?? "-"}</div>
        <div><span className="text-slate-500">Tindak lanjut:</span> {item.tindak_lanjut ?? "-"}</div>
        <div><span className="text-slate-500">Jadwal berikutnya:</span> {item.jadwal_berikutnya ?? "-"}</div>
        <div><span className="text-slate-500">Konselor:</span> {item.konselor_id}</div>
        <div><span className="text-slate-500">Status:</span> {item.status}</div>
      </div>
      {showPrivate ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
          <span className="text-slate-500">Catatan rahasia:</span> {item.catatan_rahasia ?? "-"}
        </div>
      ) : null}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Daftar Hadir Konseling</h3>
          <span className="text-xs text-slate-500">{daftarHadir.length} data</span>
        </div>
        <div className="mt-3 space-y-3">
          {daftarHadir.length ? daftarHadir.map((hadir) => (
            <div key={hadir.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{hadir.tanggal} {hadir.waktu_hadir ?? ""}</p>
                  <p className="text-xs text-slate-500">Status: {hadir.status_hadir}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{hadir.status_hadir}</span>
              </div>
              {hadir.tanda_tangan_siswa ? (
                <img src={hadir.tanda_tangan_siswa} alt="Tanda tangan siswa" className="mt-3 h-24 rounded-xl border border-slate-200 bg-slate-50 object-contain" />
              ) : null}
            </div>
          )) : <p className="text-sm text-slate-500">Belum ada daftar hadir konseling.</p>}
        </div>
      </div>
    </div>
  );
}
