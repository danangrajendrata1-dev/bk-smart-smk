"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getHomeVisitById } from "@/services/homeVisitService";
import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import type { HomeVisit } from "@/types/homeVisit";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<HomeVisit | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    void getHomeVisitById(params.id).then(setItem);
    void Promise.all([getSiswa(), getKelas()]).then(([siswa, kelas]) => { setSiswaItems(siswa); setKelasItems(kelas); });
    if (typeof window !== "undefined") {
      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const role = JSON.parse(rawUser)?.role;
          setCanEdit(role === "admin" || role === "guru_bk");
        }
      } catch {
        setCanEdit(false);
      }
    }
  }, [params?.id]);

  const siswa = useMemo(() => siswaItems.find((entry) => entry.id === item?.siswa_id), [siswaItems, item?.siswa_id]);
  const kelas = useMemo(() => kelasItems.find((entry) => entry.id === item?.kelas_id || entry.id === siswa?.kelas_id), [kelasItems, item?.kelas_id, siswa?.kelas_id]);

  if (!item) return <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500">Memuat detail...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Detail Home Visit</h1>
          {canEdit ? <Link href={`/home-visit/${item.id}/edit`} className="rounded-xl border px-4 py-3 text-sm">Edit Home Visit</Link> : null}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm grid gap-4 md:grid-cols-2">
        <div><p className="text-xs text-slate-500">Tanggal Kunjungan</p><p className="font-medium">{item.tanggal_kunjungan}</p></div>
        <div><p className="text-xs text-slate-500">Siswa</p><p className="font-medium">{siswa?.nama_lengkap ?? item.siswa_id}</p></div>
        <div><p className="text-xs text-slate-500">Kelas</p><p className="font-medium">{kelas?.nama_kelas ?? "-"}</p></div>
        <div><p className="text-xs text-slate-500">Status</p><p className="font-medium">{item.status}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Alamat</p><p className="font-medium">{item.alamat}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Tujuan</p><p className="font-medium">{item.tujuan}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Hasil Observasi</p><p className="font-medium">{item.hasil_observasi ?? "-"}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Kesimpulan</p><p className="font-medium">{item.kesimpulan ?? "-"}</p></div>
        <div><p className="text-xs text-slate-500">Petugas</p><p className="font-medium">{item.petugas_id}</p></div>
        <div><p className="text-xs text-slate-500">Foto</p><p className="font-medium">{item.foto_kunjungan_url ?? "-"}</p></div>
      </div>
      {item.tanda_tangan_ortu ? <img src={item.tanda_tangan_ortu} alt="Tanda tangan orang tua" className="h-40 rounded-2xl border bg-white object-contain" /> : null}
    </div>
  );
}
