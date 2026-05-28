"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getKelas } from "@/services/kelasService";
import { getPemanggilanOrtuById } from "@/services/pemanggilanOrtuService";
import { getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { PemanggilanOrtu } from "@/types/pemanggilanOrtu";
import type { Siswa } from "@/types/siswa";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<PemanggilanOrtu | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    void getPemanggilanOrtuById(params.id).then(setItem);
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
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Detail Pemanggilan Orang Tua</h1>
          </div>
          {canEdit ? <Link href={`/pemanggilan-ortu/${item.id}/edit`} className="rounded-xl border px-4 py-3 text-sm">Edit Pemanggilan</Link> : null}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm grid gap-4 md:grid-cols-2">
        <div><p className="text-xs text-slate-500">Tanggal</p><p className="font-medium">{item.tanggal}</p></div>
        <div><p className="text-xs text-slate-500">Siswa</p><p className="font-medium">{siswa?.nama_lengkap ?? item.siswa_id}</p></div>
        <div><p className="text-xs text-slate-500">Kelas</p><p className="font-medium">{kelas?.nama_kelas ?? "-"}</p></div>
        <div><p className="text-xs text-slate-500">Status</p><p className="font-medium">{item.status}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Alasan</p><p className="font-medium">{item.alasan_pemanggilan}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Hasil Pertemuan</p><p className="font-medium">{item.hasil_pertemuan ?? "-"}</p></div>
        <div className="md:col-span-2"><p className="text-xs text-slate-500">Kesepakatan</p><p className="font-medium">{item.kesepakatan ?? "-"}</p></div>
        <div><p className="text-xs text-slate-500">Petugas</p><p className="font-medium">{item.petugas_id}</p></div>
        <div><p className="text-xs text-slate-500">Dokumentasi</p><p className="font-medium">{item.dokumentasi_url ?? "-"}</p></div>
      </div>
      {item.tanda_tangan_ortu ? <img src={item.tanda_tangan_ortu} alt="Tanda tangan orang tua" className="h-40 rounded-2xl border bg-white object-contain" /> : null}
    </div>
  );
}
