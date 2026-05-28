"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Pencil } from "lucide-react";
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

const tabs = [
  { key: "data", label: "Data Konseling" },
  { key: "hadir", label: "Daftar Hadir" },
  { key: "riwayat", label: "Riwayat" },
] as const;

export default function Page() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Konseling | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [daftarHadir, setDaftarHadir] = useState<DaftarHadirKonseling[]>([]);
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("data");

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
  const siswa = useMemo(() => siswaItems.find((entry) => entry.id === item?.siswa_id), [siswaItems, item?.siswa_id]);
  const kelas = useMemo(() => kelasItems.find((entry) => entry.id === item?.kelas_id || entry.id === siswa?.kelas_id), [kelasItems, item?.kelas_id, siswa?.kelas_id]);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="lg:hidden">
        <div className="rounded-3xl bg-blue-700 px-4 py-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <Link href="/konseling" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-white/15">
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                {siswa?.nama_lengkap?.split(" ").slice(0, 2).map((part) => part[0]).join("") ?? "BK"}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold leading-tight text-white">Detail Konseling</h1>
              <p className="text-sm text-blue-100">{siswa?.nama_lengkap ?? "Ahmad Fauzi"} · {kelas?.nama_kelas ?? "X TKJ 1"}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-3xl bg-white p-3 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl px-3 py-2 text-xs font-medium transition ${
                  activeTab === tab.key ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700" : "bg-white text-slate-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <KonselingDetailCard item={item} siswaItems={siswaItems} kelasItems={kelasItems} showPrivate={showPrivate} />
        </div>

        <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Daftar Hadir</h2>
              <p className="text-xs text-slate-500">Pantau kehadiran siswa pada sesi konseling.</p>
            </div>
            {item?.id ? (
              <Link href={`/daftar-hadir-konseling/create?konseling_id=${item.id}`} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">
                + Tambah Konseling
              </Link>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {daftarHadir.length ? daftarHadir.map((hadir) => (
              <div key={hadir.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{hadir.tanggal} {hadir.waktu_hadir ?? ""}</p>
                    <p className="text-xs text-slate-500">Status hadir: {hadir.status_hadir}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                    hadir.status_hadir === "hadir" ? "bg-emerald-100 text-emerald-700" : hadir.status_hadir === "izin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                  }`}>{hadir.status_hadir}</span>
                </div>
                {hadir.tanda_tangan_siswa ? <img src={hadir.tanda_tangan_siswa} alt="Tanda tangan siswa" className="mt-3 h-24 rounded-xl border border-slate-200 bg-white object-contain" /> : null}
              </div>
            )) : <p className="text-sm text-slate-500">Belum ada daftar hadir untuk konseling ini.</p>}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
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
    </div>
  );
}
