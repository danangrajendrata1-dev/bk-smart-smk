"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";

import KonselingDetailCard from "@/components/konseling/KonselingDetailCard";
import { getDaftarHadirByKonseling } from "@/services/daftarHadirKonselingService";
import { getKelas } from "@/services/kelasService";
import { getKonselingById } from "@/services/konselingService";
import { getSiswa } from "@/services/siswaService";
import type { DaftarHadirKonseling } from "@/types/daftarHadirKonseling";
import type { Kelas } from "@/types/kelas";
import type { Konseling } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Konseling | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [daftarHadir, setDaftarHadir] = useState<DaftarHadirKonseling[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        setRole(JSON.parse(rawUser).role || "");
      } catch {
        setRole("");
      }
    }
    if (!params?.id) return;
    void getKonselingById(params.id).then((data) => {
      setItem(data);
      setDaftarHadir(data?.daftar_hadir ?? []);
    });
    void getDaftarHadirByKonseling(params.id).then(setDaftarHadir);
    void getSiswa().then(setSiswaItems);
    void getKelas().then(setKelasItems);
  }, [params?.id]);

  const showPrivate = useMemo(() => ["admin", "guru_bk"].includes(role), [role]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/konseling" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Detail Konseling</h1>
          <p className="mt-1 text-sm text-slate-500">Ringkasan proses konseling siswa.</p>
        </div>
      </div>

      <KonselingDetailCard item={item} siswaItems={siswaItems} kelasItems={kelasItems} showPrivate={showPrivate} />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Hadir Konseling</h2>
            <p className="text-sm text-slate-500">Pantau kehadiran dan tanda tangan siswa untuk konseling ini.</p>
          </div>
          {item?.id ? (
            <Link href={`/daftar-hadir-konseling/create?konseling_id=${item.id}`} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              <CheckCircle2 className="h-4 w-4" />
              Isi Daftar Hadir
            </Link>
          ) : null}
        </div>
        <div className="mt-4 space-y-3">
          {daftarHadir.length ? daftarHadir.map((hadir) => (
            <div key={hadir.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{hadir.tanggal} {hadir.waktu_hadir ?? ""}</p>
                  <p className="text-sm text-slate-500">Status: {hadir.status_hadir}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  hadir.status_hadir === "hadir" ? "bg-emerald-100 text-emerald-700" : hadir.status_hadir === "izin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                }`}>{hadir.status_hadir}</span>
              </div>
              {hadir.tanda_tangan_siswa ? <img src={hadir.tanda_tangan_siswa} alt="Tanda tangan siswa" className="mt-3 h-24 rounded-xl border border-slate-200 bg-white object-contain" /> : null}
            </div>
          )) : <p className="text-sm text-slate-500">Belum ada daftar hadir untuk konseling ini.</p>}
        </div>
      </div>
    </div>
  );
}
