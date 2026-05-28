"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, RefreshCw, Send } from "lucide-react";

import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import { downloadSuratPeringatanPdf, generateSuratPeringatanPdf, getSuratPeringatanById } from "@/services/suratPeringatanService";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";
import type { SuratPeringatan } from "@/types/suratPeringatan";
import { buildWaLink } from "@/lib/waClient";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<SuratPeringatan | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);

  useEffect(() => {
    if (!params?.id) return;
    void getSuratPeringatanById(params.id).then(setItem);
    void Promise.all([getSiswa(), getKelas()]).then(([siswa, kelas]) => {
      setSiswaItems(siswa);
      setKelasItems(kelas);
    });
  }, [params?.id]);

  const siswa = useMemo(() => siswaItems.find((entry) => entry.id === item?.siswa_id), [siswaItems, item?.siswa_id]);
  const kelas = useMemo(() => kelasItems.find((entry) => entry.id === item?.kelas_id || entry.id === siswa?.kelas_id), [kelasItems, item?.kelas_id, siswa?.kelas_id]);

  const handleDownload = async () => {
    if (!item) return;
    const blob = await downloadSuratPeringatanPdf(item.id);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Detail Surat Peringatan</h1>
            <p className="mt-1 text-sm text-slate-500">Ringkasan dokumen dan tindakan tindak lanjut.</p>
          </div>
          {item ? (
            <div className="flex flex-wrap gap-2">
              <button onClick={async () => { await generateSuratPeringatanPdf(item.id); await getSuratPeringatanById(item.id).then(setItem); }} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
                <RefreshCw className="h-4 w-4" />
                Generate PDF
              </button>
              {item.file_pdf_url ? (
                <button onClick={() => void handleDownload()} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              ) : null}
              {siswa?.no_wa_ortu ? (
                <a href={buildWaLink(siswa.no_wa_ortu, `Yth. Bapak/Ibu Orang Tua/Wali dari ${siswa.nama_lengkap},\nKami informasikan bahwa siswa tersebut mendapatkan ${item.jenis_sp} dengan total poin ${item.total_poin}.\nMohon perhatian dan kerja samanya.\nGuru BK SMK`) ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
                  <Send className="h-4 w-4" />
                  WhatsApp
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {item ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-xs text-slate-500">Nomor Surat</p><p className="font-medium text-slate-900">{item.nomor_surat}</p></div>
              <div><p className="text-xs text-slate-500">Tanggal SP</p><p className="font-medium text-slate-900">{item.tanggal_sp}</p></div>
              <div><p className="text-xs text-slate-500">Siswa</p><p className="font-medium text-slate-900">{siswa?.nama_lengkap ?? item.siswa_id}</p></div>
              <div><p className="text-xs text-slate-500">Kelas</p><p className="font-medium text-slate-900">{kelas?.nama_kelas ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Jenis SP</p><p className="font-medium text-slate-900">{item.jenis_sp}</p></div>
              <div><p className="text-xs text-slate-500">Total Poin</p><p className="font-medium text-slate-900">{item.total_poin}</p></div>
              <div className="md:col-span-2"><p className="text-xs text-slate-500">Alasan</p><p className="font-medium text-slate-900">{item.alasan_sp}</p></div>
              <div className="md:col-span-2"><p className="text-xs text-slate-500">Tindakan</p><p className="font-medium text-slate-900">{item.tindakan ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">PDF</p><p className="font-medium text-slate-900">{item.file_pdf_url ? "Tersedia" : "Belum ada"}</p></div>
              <div><p className="text-xs text-slate-500">Status WA</p><p className="font-medium text-slate-900">{item.status_kirim_wa}</p></div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Orang Tua/Wali</p>
              <p className="font-medium text-slate-900">{siswa?.nama_ortu ?? "-"}</p>
              <p className="text-sm text-slate-500">{siswa?.no_wa_ortu ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Pembinaan</p>
              <p className="font-medium text-slate-900">{item.jenis_sp}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              Gunakan tombol generate untuk membuat PDF, lalu unduh atau kirim ke orang tua via WhatsApp.
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500">Memuat detail surat peringatan...</div>
      )}
    </div>
  );
}
