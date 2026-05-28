"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import SiswaForm from "@/components/siswa/SiswaForm";
import { getKelas } from "@/services/kelasService";
import { getSiswaById, updateSiswa } from "@/services/siswaService";
import type { Kelas } from "@/types/kelas";
import type { SiswaPayload } from "@/types/siswa";

const emptyForm: SiswaPayload = {
  foto_url: "",
  nama_lengkap: "",
  nis: "",
  nisn: "",
  jenis_kelamin: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  kelas_id: "",
  jurusan: "",
  alamat: "",
  no_hp_siswa: "",
  nama_ortu: "",
  no_wa_ortu: "",
  status_siswa: "aktif",
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<SiswaPayload>(emptyForm);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getKelas().then(setKelasItems);
    if (!params?.id) return;
    void getSiswaById(params.id).then((data) => {
      if (!data) return;
      setForm({
        foto_url: data.foto_url ?? "",
        nama_lengkap: data.nama_lengkap,
        nis: data.nis,
        nisn: data.nisn ?? "",
        jenis_kelamin: data.jenis_kelamin ?? "",
        tempat_lahir: data.tempat_lahir ?? "",
        tanggal_lahir: data.tanggal_lahir ?? "",
        kelas_id: data.kelas_id,
        jurusan: data.jurusan ?? "",
        alamat: data.alamat ?? "",
        no_hp_siswa: data.no_hp_siswa ?? "",
        nama_ortu: data.nama_ortu ?? "",
        no_wa_ortu: data.no_wa_ortu ?? "",
        status_siswa: data.status_siswa ?? "aktif",
      });
    });
  }, [params?.id]);

  const onSubmit = async () => {
    if (!params?.id) return;
    setLoading(true);
    setError("");
    try {
      await updateSiswa(params.id, form);
      router.push(`/siswa/${params.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.response?.data?.message || "Gagal menyimpan perubahan siswa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Siswa</h1>
        <p className="mt-1 text-sm text-slate-500">Perbarui data siswa dengan hati-hati.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SiswaForm value={form} kelasItems={kelasItems} onChange={setForm} onSubmit={onSubmit} submitLabel={loading ? "Menyimpan..." : "Simpan Perubahan"} />
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
