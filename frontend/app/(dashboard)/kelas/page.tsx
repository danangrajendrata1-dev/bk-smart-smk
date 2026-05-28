"use client";

import { useEffect, useState } from "react";

import KelasForm from "@/components/kelas/KelasForm";
import KelasTable from "@/components/kelas/KelasTable";
import { createKelas, deleteKelas, getKelas, updateKelas } from "@/services/kelasService";
import type { Kelas, KelasPayload } from "@/types/kelas";

const emptyForm: KelasPayload = { nama_kelas: "", tingkat: "", jurusan: "" };

export default function Page() {
  const [items, setItems] = useState<Kelas[]>([]);
  const [form, setForm] = useState<KelasPayload>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => setItems(await getKelas());

  useEffect(() => { void load(); }, []);

  const onSubmit = async () => {
    if (selectedId) await updateKelas(selectedId, form);
    else await createKelas(form);
    setForm(emptyForm);
    setSelectedId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Data Kelas</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola kelas aktif dan nonaktif.</p>
          </div>
        </div>
        <div className="mt-6">
          <KelasForm value={form} onChange={setForm} onSubmit={onSubmit} submitLabel={selectedId ? "Simpan Perubahan" : "Tambah Kelas"} />
        </div>
      </div>

      <KelasTable
        items={items}
        onEdit={(item) => {
          setSelectedId(item.id);
          setForm({
            nama_kelas: item.nama_kelas,
            tingkat: item.tingkat,
            jurusan: item.jurusan,
            wali_kelas_id: item.wali_kelas_id ?? undefined,
            tahun_ajaran: item.tahun_ajaran ?? undefined,
            status: item.status ?? "aktif",
          });
        }}
        onDelete={async (item) => {
          await deleteKelas(item.id);
          await load();
        }}
      />
    </div>
  );
}
