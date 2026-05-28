"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import KonselingForm from "@/components/konseling/KonselingForm";
import { getKelas } from "@/services/kelasService";
import { getKonselingById, updateKonseling } from "@/services/konselingService";
import { getSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { Konseling, KonselingUpdatePayload } from "@/types/konseling";
import type { Siswa } from "@/types/siswa";

const emptyValue: KonselingUpdatePayload = {
  tanggal: "",
  siswa_id: "",
  jenis_konseling: "",
  permasalahan: "",
  hasil_konseling: "",
  tindak_lanjut: "",
  jadwal_berikutnya: "",
  catatan_rahasia: "",
  status: "terjadwal",
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [value, setValue] = useState<KonselingUpdatePayload>(emptyValue);
  const [item, setItem] = useState<Konseling | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    void Promise.all([getSiswa(), getKelas()]).then(([siswa, kelas]) => {
      setSiswaItems(siswa);
      setKelasItems(kelas);
    });
    if (!params?.id) return;
    void getKonselingById(params.id).then((data) => {
      if (!data) return;
      setItem(data);
      setValue({
        tanggal: data.tanggal,
        siswa_id: data.siswa_id,
        jenis_konseling: data.jenis_konseling,
        permasalahan: data.permasalahan,
        hasil_konseling: data.hasil_konseling ?? "",
        tindak_lanjut: data.tindak_lanjut ?? "",
        jadwal_berikutnya: data.jadwal_berikutnya ?? "",
        catatan_rahasia: data.catatan_rahasia ?? "",
        status: data.status,
      });
    });
  }, [params?.id]);

  const selectedSiswa = useMemo(() => siswaItems.find((entry) => entry.id === value.siswa_id), [siswaItems, value.siswa_id]);
  const selectedKelas = useMemo(() => kelasItems.find((entry) => entry.id === selectedSiswa?.kelas_id), [kelasItems, selectedSiswa?.kelas_id]);

  const handleSubmit = async () => {
    if (!params?.id) return;
    if (!value.tanggal || !value.siswa_id || !value.jenis_konseling || !value.permasalahan) {
      setError("Tanggal, siswa, jenis konseling, dan permasalahan wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await updateKonseling(params.id, value);
      router.push(`/konseling/${params.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal memperbarui konseling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/konseling/${params?.id ?? ""}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Konseling</h1>
          <p className="mt-1 text-sm text-slate-500">Perbarui data konseling dengan rapi.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        <KonselingForm
          value={value as Required<KonselingUpdatePayload>}
          siswaItems={siswaItems}
          kelasItems={kelasItems}
          onChange={setValue}
          onSubmit={handleSubmit}
          submitLabel={loading ? "Menyimpan..." : "Simpan Perubahan"}
          showPrivate={["admin", "guru_bk"].includes(role)}
        />
        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Siswa Terpilih</p>
            <p className="font-medium">{selectedSiswa?.nama_lengkap ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Kelas</p>
            <p className="font-medium">{selectedKelas?.nama_kelas ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Konselor</p>
            <p className="font-medium">Otomatis dari user login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
