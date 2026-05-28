"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

import { deleteDaftarHadirKonseling, getDaftarHadirKonselingById } from "@/services/daftarHadirKonselingService";
import { getKelas } from "@/services/kelasService";
import { getKonselingById } from "@/services/konselingService";
import { getSiswa } from "@/services/siswaService";
import type { DaftarHadirKonseling } from "@/types/daftarHadirKonseling";
import type { Kelas } from "@/types/kelas";
import type { Konseling } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<DaftarHadirKonseling | null>(null);
  const [konseling, setKonseling] = useState<Konseling | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const detail = await getDaftarHadirKonselingById(params.id);
        const [siswa, kelas] = await Promise.all([
          getSiswa(),
          getKelas(),
        ]);
        const konselingData = detail?.konseling_id ? await getKonselingById(detail.konseling_id).catch(() => null) : null;
        setItem(detail ?? null);
        setKonseling(konselingData);
        setSiswaItems(siswa);
        setKelasItems(kelas);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [params?.id]);

  const siswa = useMemo(() => siswaItems.find((data) => data.id === item?.siswa_id || data.id === konseling?.siswa_id), [item?.siswa_id, konseling?.siswa_id, siswaItems]);
  const kelas = useMemo(() => kelasItems.find((data) => data.id === siswa?.kelas_id || data.id === konseling?.kelas_id), [kelasItems, siswa?.kelas_id, konseling?.kelas_id]);

  const handleDelete = async () => {
    if (!item) return;
    await deleteDaftarHadirKonseling(item.id);
    router.push("/daftar-hadir-konseling");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/daftar-hadir-konseling" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">Detail Daftar Hadir</h1>
          <p className="mt-1 text-sm text-slate-500">Ringkasan kehadiran dan tanda tangan siswa.</p>
        </div>
        {item ? (
          <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm">
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
        ) : null}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat detail...</p>
        ) : item ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div><p className="text-xs text-slate-500">Konseling</p><p className="font-medium text-slate-900">{konseling?.tanggal ?? item.konseling_id}</p></div>
            <div><p className="text-xs text-slate-500">Siswa</p><p className="font-medium text-slate-900">{siswa?.nama_lengkap ?? item.siswa_id}</p></div>
            <div><p className="text-xs text-slate-500">Kelas</p><p className="font-medium text-slate-900">{kelas?.nama_kelas ?? "-"}</p></div>
            <div><p className="text-xs text-slate-500">Tanggal</p><p className="font-medium text-slate-900">{item.tanggal}</p></div>
            <div><p className="text-xs text-slate-500">Waktu Hadir</p><p className="font-medium text-slate-900">{item.waktu_hadir ?? "-"}</p></div>
            <div><p className="text-xs text-slate-500">Status Hadir</p><p className="font-medium text-slate-900">{item.status_hadir}</p></div>
            <div><p className="text-xs text-slate-500">Catatan</p><p className="font-medium text-slate-900">{item.catatan ?? "-"}</p></div>
            <div><p className="text-xs text-slate-500">Dibuat Oleh</p><p className="font-medium text-slate-900">{item.created_by}</p></div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Daftar hadir tidak ditemukan.</p>
        )}
      </div>

      {item?.tanda_tangan_siswa ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tanda Tangan Siswa</h2>
          <img src={item.tanda_tangan_siswa} alt="Tanda tangan siswa" className="mt-4 h-40 rounded-2xl border border-slate-200 bg-slate-50 object-contain" />
        </div>
      ) : null}
    </div>
  );
}
