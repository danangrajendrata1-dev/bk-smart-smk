"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SignaturePad from "@/components/ui/SignaturePad";
import { createHomeVisit } from "@/services/homeVisitService";
import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import type { HomeVisitCreatePayload } from "@/types/homeVisit";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

const emptyForm: HomeVisitCreatePayload = { tanggal_kunjungan: "", siswa_id: "", alamat: "", tujuan: "", hasil_observasi: "", kesimpulan: "", foto_kunjungan_url: "", tanda_tangan_ortu: "", status: "dijadwalkan" };

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    void Promise.all([getSiswa(), getKelas()]).then(([siswa, kelas]) => { setSiswaItems(siswa); setKelasItems(kelas); });
  }, [router]);

  useEffect(() => {
    const siswaId = searchParams.get("siswa_id");
    if (siswaId) setForm((prev) => ({ ...prev, siswa_id: siswaId }));
  }, [searchParams]);

  const siswa = useMemo(() => siswaItems.find((item) => item.id === form.siswa_id), [siswaItems, form.siswa_id]);
  const kelas = kelasItems.find((item) => item.id === siswa?.kelas_id);

  useEffect(() => {
    if (siswa?.alamat && !form.alamat) {
      setForm((prev) => ({ ...prev, alamat: siswa.alamat ?? "" }));
    }
  }, [siswa?.alamat]);

  const submit = async () => {
    if (!form.siswa_id || !form.tujuan || !form.status) {
      setError("Siswa, tujuan, dan status wajib diisi.");
      return;
    }
    if (form.status === "selesai" && !form.tanda_tangan_ortu) {
      setError("Tanda tangan orang tua wajib jika status selesai.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await createHomeVisit(form);
      router.push(`/home-visit/${created.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal menyimpan home visit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Home Visit</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border px-4 py-3" type="date" value={form.tanggal_kunjungan ?? ""} onChange={(e) => setForm({ ...form, tanggal_kunjungan: e.target.value })} />
          <select className="rounded-xl border px-4 py-3" value={form.siswa_id} onChange={(e) => setForm({ ...form, siswa_id: e.target.value, alamat: siswa?.alamat ?? "" })}>
            <option value="">Pilih siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <input className="rounded-xl border px-4 py-3" value={kelas?.nama_kelas ?? "-"} disabled />
          <input className="rounded-xl border px-4 py-3" placeholder="Alamat" value={form.alamat ?? ""} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Tujuan" value={form.tujuan} onChange={(e) => setForm({ ...form, tujuan: e.target.value })} />
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Hasil observasi" value={form.hasil_observasi ?? ""} onChange={(e) => setForm({ ...form, hasil_observasi: e.target.value })} />
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Kesimpulan" value={form.kesimpulan ?? ""} onChange={(e) => setForm({ ...form, kesimpulan: e.target.value })} />
          <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="URL foto kunjungan" value={form.foto_kunjungan_url ?? ""} onChange={(e) => setForm({ ...form, foto_kunjungan_url: e.target.value })} />
          <select className="rounded-xl border px-4 py-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="dijadwalkan">Dijadwalkan</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>

        {form.status === "selesai" ? (
          <div className="mt-5">
            <SignaturePad value={form.tanda_tangan_ortu ?? ""} onChange={(value) => setForm({ ...form, tanda_tangan_ortu: value })} />
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button type="button" onClick={submit} disabled={saving} className="mt-5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
