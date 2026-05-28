"use client";

import { useEffect, useMemo, useState } from "react";

import { createMasterPelanggaran, deleteMasterPelanggaran, getMasterPelanggaran, updateMasterPelanggaran } from "@/services/masterPelanggaranService";
import type { MasterPelanggaran, MasterPelanggaranPayload } from "@/types/masterPelanggaran";

const emptyForm: MasterPelanggaranPayload = { jenis_pelanggaran: "", poin: 0, kategori: "", tindakan_default: "", status: "aktif" };

export default function Page() {
  const [items, setItems] = useState<MasterPelanggaran[]>([]);
  const [form, setForm] = useState<MasterPelanggaranPayload>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const load = async () => setItems(await getMasterPelanggaran());

  useEffect(() => { void load(); }, []);

  const onSubmit = async () => {
    if (!form.jenis_pelanggaran || form.poin < 0) {
      setError("Jenis pelanggaran wajib diisi dan poin minimal 0.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (selected) await updateMasterPelanggaran(selected.id, form);
      else await createMasterPelanggaran(form);
      setForm(emptyForm);
      setSelectedId(null);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.response?.data?.message || "Gagal menyimpan master pelanggaran.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Master Pelanggaran</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          <input className="rounded-xl border px-4 py-3" placeholder="Jenis pelanggaran" value={form.jenis_pelanggaran} onChange={(e) => setForm({ ...form, jenis_pelanggaran: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" placeholder="Poin" type="number" value={form.poin} onChange={(e) => setForm({ ...form, poin: Number(e.target.value) })} />
          <input className="rounded-xl border px-4 py-3" placeholder="Kategori" value={form.kategori ?? ""} onChange={(e) => setForm({ ...form, kategori: e.target.value })} />
          <input className="rounded-xl border px-4 py-3" placeholder="Tindakan default" value={form.tindakan_default ?? ""} onChange={(e) => setForm({ ...form, tindakan_default: e.target.value })} />
          <button className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={onSubmit} disabled={saving}>
            {saving ? "Menyimpan..." : selected ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Poin</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Tindakan Default</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.jenis_pelanggaran}</td>
                <td className="px-4 py-3">{item.poin}</td>
                <td className="px-4 py-3">{item.kategori ?? "-"}</td>
                <td className="px-4 py-3">{item.tindakan_default ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${item.status === "nonaktif" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {item.status ?? "aktif"}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="rounded-lg border px-3 py-1" onClick={() => { setSelectedId(item.id); setForm({ jenis_pelanggaran: item.jenis_pelanggaran, poin: item.poin, kategori: item.kategori ?? "", tindakan_default: item.tindakan_default ?? "", status: item.status ?? "aktif" }); }}>Edit</button>
                  <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={async () => { await deleteMasterPelanggaran(item.id); await load(); }}>Nonaktifkan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
