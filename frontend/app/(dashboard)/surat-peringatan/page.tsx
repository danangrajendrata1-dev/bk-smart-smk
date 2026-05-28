"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, ExternalLink, FileText, Plus, RefreshCw, Send } from "lucide-react";

import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import { deleteSuratPeringatan, downloadSuratPeringatanPdf, generateSuratPeringatanPdf, getSuratPeringatanList } from "@/services/suratPeringatanService";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";
import type { SuratPeringatan } from "@/types/suratPeringatan";
import { buildWaLink } from "@/lib/waClient";

export default function Page() {
  const [items, setItems] = useState<SuratPeringatan[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [filters, setFilters] = useState({ siswa_id: "", kelas_id: "", jenis_sp: "", tanggal_awal: "", tanggal_akhir: "" });

  const load = async () => {
    setItems(await getSuratPeringatanList(filters));
    setSiswaItems(await getSiswa());
    setKelasItems(await getKelas());
  };

  useEffect(() => { void load(); }, [filters]);

  const filtered = useMemo(() => items, [items]);

  const handleDownload = async (id: string) => {
    const blob = await downloadSuratPeringatanPdf(id);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Surat Peringatan</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola rekomendasi, pembuatan, dan unduhan surat peringatan.</p>
          </div>
          <Link href="/surat-peringatan/create" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Buat SP
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          <select className="rounded-xl border px-4 py-3" value={filters.siswa_id} onChange={(e) => setFilters({ ...filters, siswa_id: e.target.value })}>
            <option value="">Semua siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filters.kelas_id} onChange={(e) => setFilters({ ...filters, kelas_id: e.target.value })}>
            <option value="">Semua kelas</option>
            {kelasItems.map((item) => <option key={item.id} value={item.id}>{item.nama_kelas}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filters.jenis_sp} onChange={(e) => setFilters({ ...filters, jenis_sp: e.target.value })}>
            <option value="">Semua jenis SP</option>
            {["SP1", "SP2", "SP3"].map((jenis) => <option key={jenis} value={jenis}>{jenis}</option>)}
          </select>
          <input className="rounded-xl border px-4 py-3" type="date" value={filters.tanggal_awal} onChange={(e) => setFilters({ ...filters, tanggal_awal: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" type="date" value={filters.tanggal_akhir} onChange={(e) => setFilters({ ...filters, tanggal_akhir: e.target.value })} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Nomor</th>
              <th className="px-4 py-3">Siswa</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Total Poin</th>
              <th className="px-4 py-3">PDF</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const siswa = siswaItems.find((s) => s.id === item.siswa_id);
              const kelas = kelasItems.find((k) => k.id === item.kelas_id);
              return (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.nomor_surat}</td>
                  <td className="px-4 py-3">{siswa?.nama_lengkap ?? "-"}</td>
                  <td className="px-4 py-3">{kelas?.nama_kelas ?? "-"}</td>
                  <td className="px-4 py-3">{item.jenis_sp}</td>
                  <td className="px-4 py-3">{item.total_poin}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.file_pdf_url ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {item.file_pdf_url ? "Tersedia" : "Belum ada"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/surat-peringatan/${item.id}`} className="rounded-lg border px-3 py-1">Detail</Link>
                      <button className="rounded-lg border px-3 py-1" onClick={async () => { await generateSuratPeringatanPdf(item.id); await load(); }}>
                        <RefreshCw className="inline h-4 w-4" />
                      </button>
                      {item.file_pdf_url ? (
                        <button className="rounded-lg border px-3 py-1" onClick={() => void handleDownload(item.id)}>
                          <Download className="inline h-4 w-4" />
                        </button>
                      ) : null}
                      {siswa?.no_wa_ortu ? (
                        <a
                          className="rounded-lg border px-3 py-1"
                          href={buildWaLink(siswa.no_wa_ortu, `Yth. Bapak/Ibu Orang Tua/Wali dari ${siswa.nama_lengkap},\nKami informasikan bahwa siswa tersebut mendapatkan ${item.jenis_sp} dengan total poin ${item.total_poin}.\nMohon perhatian dan kerja samanya.\nGuru BK SMK`) ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Send className="inline h-4 w-4" />
                        </a>
                      ) : null}
                      <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={async () => { await deleteSuratPeringatan(item.id); await load(); }}>
                        Hapus
                      </button>
                    </div>
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
