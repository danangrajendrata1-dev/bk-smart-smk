"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import KonselingTable from "@/components/konseling/KonselingTable";
import { getKelas } from "@/services/kelasService";
import { deleteKonseling, getKonselingList } from "@/services/konselingService";
import { getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { Konseling } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

const statusOptions = ["terjadwal", "selesai", "dibatalkan"];

export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState<Konseling[]>([]);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [filterSiswa, setFilterSiswa] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [role, setRole] = useState("");

  const load = async () => {
    setItems(await getKonselingList({
      tanggal_awal: tanggalAwal || undefined,
      tanggal_akhir: tanggalAkhir || undefined,
      siswa_id: filterSiswa || undefined,
      kelas_id: filterKelas || undefined,
      jenis_konseling: filterJenis || undefined,
      status: filterStatus || undefined,
    }));
    setSiswaItems(await getSiswa());
    setKelasItems(await getKelas());
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setRole(JSON.parse(user).role || "");
      } catch {
        setRole("");
      }
    }
    void load();
  }, [tanggalAwal, tanggalAkhir, filterSiswa, filterKelas, filterJenis, filterStatus]);

  const showPrivate = ["admin", "guru_bk"].includes(role);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Konseling</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola konseling siswa dan ringkasan tindak lanjut.</p>
          </div>
          <Link href="/konseling/create" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Tambah Konseling
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <input className="rounded-xl border px-4 py-3" type="date" value={tanggalAwal} onChange={(e) => setTanggalAwal(e.target.value)} />
          <input className="rounded-xl border px-4 py-3" type="date" value={tanggalAkhir} onChange={(e) => setTanggalAkhir(e.target.value)} />
          <select className="rounded-xl border px-4 py-3" value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)}>
            <option value="">Filter kelas</option>
            {kelasItems.map((item) => <option key={item.id} value={item.id}>{item.nama_kelas}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filterSiswa} onChange={(e) => setFilterSiswa(e.target.value)}>
            <option value="">Filter siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)}>
            <option value="">Jenis konseling</option>
            {["pribadi", "sosial", "belajar", "karier"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="rounded-xl border px-4 py-3" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Status</option>
            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <KonselingTable
        items={items}
        siswaItems={siswaItems}
        kelasItems={kelasItems}
        onEdit={(item) => router.push(`/konseling/${item.id}/edit`)}
        onDelete={async (item) => {
          await deleteKonseling(item.id);
          await load();
        }}
      />

      {!showPrivate ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
          Catatan rahasia disembunyikan untuk role ini.
        </div>
      ) : null}
    </div>
  );
}
