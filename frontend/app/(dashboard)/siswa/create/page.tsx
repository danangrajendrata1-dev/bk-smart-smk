"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SiswaForm from "@/components/siswa/SiswaForm";
import { createSiswa } from "@/services/siswaService";
import { getKelas } from "@/services/kelasService";
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
  const router = useRouter();
  const [form, setForm] = useState<SiswaPayload>(emptyForm);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void getKelas().then(setKelasItems);
  }, []);

  const onSubmit = async () => {
    setError("");
    try {
      const result = await createSiswa(form);
      router.push(`/siswa/${result.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Gagal menyimpan siswa.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Siswa</h1>
        <p className="mt-1 text-sm text-slate-500">Lengkapi data siswa dengan teliti.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SiswaForm value={form} kelasItems={kelasItems} onChange={setForm} onSubmit={onSubmit} submitLabel="Simpan Siswa" />
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
