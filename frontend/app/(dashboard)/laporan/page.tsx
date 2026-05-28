"use client";

import { useEffect, useMemo, useState } from "react";

import { getKelas } from "@/services/kelasService";
import {
  getLaporanHomeVisit,
  getLaporanKonseling,
  getLaporanPelanggaran,
  getLaporanPemanggilanOrtu,
  getLaporanPresensi,
  getLaporanSummary,
  getLaporanSuratPeringatan,
} from "@/services/laporanService";
import { getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { LaporanCard, LaporanItemHomeVisit, LaporanItemKonseling, LaporanItemPelanggaran, LaporanItemPemanggilanOrtu, LaporanItemPresensi, LaporanItemSP, LaporanSummary } from "@/types/laporan";
import type { Siswa } from "@/types/siswa";

const sectionCard = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

export default function Page() {
  const [summary, setSummary] = useState<LaporanSummary | null>(null);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [pelanggaran, setPelanggaran] = useState<LaporanItemPelanggaran[]>([]);
  const [presensi, setPresensi] = useState<LaporanItemPresensi[]>([]);
  const [konseling, setKonseling] = useState<LaporanItemKonseling[]>([]);
  const [sp, setSp] = useState<LaporanItemSP[]>([]);
  const [pemanggilanOrtu, setPemanggilanOrtu] = useState<LaporanItemPemanggilanOrtu[]>([]);
  const [homeVisit, setHomeVisit] = useState<LaporanItemHomeVisit[]>([]);

  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [siswaId, setSiswaId] = useState("");

  useEffect(() => {
    void Promise.all([getLaporanSummary(), getKelas(), getSiswa()]).then(([sum, kelas, siswa]) => {
      setSummary(sum);
      setKelasItems(kelas);
      setSiswaItems(siswa);
    });
  }, []);

  const loadReports = async () => {
    const params = {
      tanggal_awal: tanggalAwal || undefined,
      tanggal_akhir: tanggalAkhir || undefined,
      kelas_id: kelasId || undefined,
      siswa_id: siswaId || undefined,
    };
    const [pel, pres, kon, surat, ortu, visit] = await Promise.all([
      getLaporanPelanggaran(params),
      getLaporanPresensi(params),
      getLaporanKonseling(params),
      getLaporanSuratPeringatan({ ...params, jenis_sp: undefined }),
      getLaporanPemanggilanOrtu(params),
      getLaporanHomeVisit(params),
    ]);
    setPelanggaran(pel.items);
    setPresensi(pres.items);
    setKonseling(kon.items);
    setSp(surat.items);
    setPemanggilanOrtu(ortu.items);
    setHomeVisit(visit.items);
  };

  useEffect(() => {
    void loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kelasLabel = useMemo(() => kelasItems.find((item) => item.id === kelasId)?.nama_kelas ?? "Semua kelas", [kelasId, kelasItems]);
  const siswaLabel = useMemo(() => siswaItems.find((item) => item.id === siswaId)?.nama_lengkap ?? "Semua siswa", [siswaId, siswaItems]);

  const summaryCards: LaporanCard[] = summary?.cards ?? [];
  const spRingkasan = useMemo(() => {
    const counts = sp.reduce<Record<string, number>>((acc, item) => {
      acc[item.jenis_sp] = (acc[item.jenis_sp] ?? 0) + 1;
      return acc;
    }, { SP1: 0, SP2: 0, SP3: 0 });
    return counts;
  }, [sp]);
  const presensiRingkasan = useMemo(() => {
    return presensi.reduce<Record<string, number>>((acc, item) => {
      const key = item.status || "lainnya";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [presensi]);

  return (
    <div className="space-y-6">
      <div className={sectionCard}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Laporan BK</h1>
            <p className="mt-1 text-sm text-slate-500">Rekap inti BK untuk guru BK, kesiswaan, dan kepala sekolah.</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Filter aktif</p>
            <p className="mt-1 font-medium text-slate-700">{kelasLabel} · {siswaLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className={sectionCard}>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.detail ?? "-"}</p>
          </div>
        ))}
      </div>

      <div className={sectionCard}>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Tanggal Awal</span>
            <input value={tanggalAwal} onChange={(e) => setTanggalAwal(e.target.value)} type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Tanggal Akhir</span>
            <input value={tanggalAkhir} onChange={(e) => setTanggalAkhir(e.target.value)} type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Kelas</span>
            <select value={kelasId} onChange={(e) => setKelasId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400">
              <option value="">Semua Kelas</option>
              {kelasItems.map((item) => <option key={item.id} value={item.id}>{item.nama_kelas}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Siswa</span>
            <select value={siswaId} onChange={(e) => setSiswaId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400">
              <option value="">Semua Siswa</option>
              {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => void loadReports()} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Tampilkan</button>
          <button type="button" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Export PDF</button>
          <button type="button" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Export Excel</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={sectionCard}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Laporan Presensi</h2>
            <p className="text-sm text-slate-500">{presensi.length} data</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Hadir {presensiRingkasan.hadir ?? 0}</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Izin {presensiRingkasan.izin ?? 0}</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">Sakit {presensiRingkasan.sakit ?? 0}</span>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Alfa {presensiRingkasan.alfa ?? 0}</span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Terlambat {presensiRingkasan.terlambat ?? 0}</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {presensi.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.siswa_id}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
                {!presensi.length ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={3}>Belum ada data.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Laporan Pelanggaran</h2>
            <p className="text-sm text-slate-500">{pelanggaran.length} kasus · {pelanggaran.reduce((sum, item) => sum + Number(item.poin || 0), 0)} poin</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-4 py-3">Poin</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pelanggaran.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal_kejadian}</td>
                    <td className="px-4 py-3">{item.siswa_id}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">{item.poin}</td>
                    <td className="px-4 py-3">{item.status_tindak_lanjut}</td>
                  </tr>
                ))}
                {!pelanggaran.length ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={4}>Belum ada data.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Laporan Konseling</h2>
            <p className="text-sm text-slate-500">{konseling.length} sesi</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {konseling.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.siswa_id}</td>
                    <td className="px-4 py-3">{item.jenis_konseling}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
                {!konseling.length ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={4}>Belum ada data.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Surat Peringatan</h2>
            <p className="text-sm text-slate-500">{sp.length} surat</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">SP1 {spRingkasan.SP1 ?? 0}</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">SP2 {spRingkasan.SP2 ?? 0}</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">SP3 {spRingkasan.SP3 ?? 0}</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nomor</th>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-4 py-3">Jenis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sp.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.nomor_surat}</td>
                    <td className="px-4 py-3">{item.siswa_id}</td>
                    <td className="px-4 py-3">{item.jenis_sp}</td>
                  </tr>
                ))}
                {!sp.length ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={3}>Belum ada data.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Pemanggilan Orang Tua</h2>
            <p className="text-sm text-slate-500">{pemanggilanOrtu.length} data</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pemanggilanOrtu.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.siswa_id}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
                {!pemanggilanOrtu.length ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={3}>Belum ada data.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Home Visit</h2>
            <p className="text-sm text-slate-500">{homeVisit.length} data</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Siswa</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {homeVisit.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal_kunjungan}</td>
                    <td className="px-4 py-3">{item.siswa_id}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
                {!homeVisit.length ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={3}>Belum ada data.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
