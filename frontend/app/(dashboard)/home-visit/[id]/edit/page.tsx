"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import SignaturePad from "@/components/ui/SignaturePad";
import { getHomeVisitById, updateHomeVisit } from "@/services/homeVisitService";
import { getKelas } from "@/services/kelasService";
import { getSiswa } from "@/services/siswaService";
import type { HomeVisit, HomeVisitUpdatePayload } from "@/types/homeVisit";
import type { Kelas } from "@/types/kelas";
import type { Siswa } from "@/types/siswa";

const emptyForm: HomeVisitUpdatePayload = {
  tanggal_kunjungan: "",
  siswa_id: "",
  alamat: "",
  tujuan: "",
  hasil_observasi: "",
  kesimpulan: "",
  foto_kunjungan_url: "",
  tanda_tangan_ortu: "",
  status: "dijadwalkan",
};

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<HomeVisitUpdatePayload>(emptyForm);
  const [current, setCurrent] = useState<HomeVisit | null>(null);
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    if (!params?.id) return;
    void Promise.all([getHomeVisitById(params.id), getSiswa(), getKelas()]).then(([item, siswa, kelas]) => {
      setCurrent(item);
      setSiswaItems(siswa);
      setKelasItems(kelas);
      setForm({
        tanggal_kunjungan: item.tanggal_kunjungan,
        siswa_id: item.siswa_id,
        alamat: item.alamat,
        tujuan: item.tujuan,
        hasil_observasi: item.hasil_observasi ?? "",
        kesimpulan: item.kesimpulan ?? "",
        foto_kunjungan_url: item.foto_kunjungan_url ?? "",
        tanda_tangan_ortu: item.tanda_tangan_ortu ?? "",
        status: item.status,
      });
    });
  }, [params?.id, router]);

  const siswa = useMemo(() => siswaItems.find((item) => item.id === form.siswa_id), [form.siswa_id, siswaItems]);
  const kelas = kelasItems.find((item) => item.id === siswa?.kelas_id);

  useEffect(() => {
    if (siswa?.alamat && !form.alamat) {
      setForm((prev) => ({ ...prev, alamat: siswa.alamat ?? "" }));
    }
  }, [form.alamat, siswa?.alamat]);

  const canEdit = typeof window !== "undefined" ? (() => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return false;
      const role = JSON.parse(rawUser)?.role;
      return role === "admin" || role === "guru_bk";
    } catch {
      return false;
    }
  })() : false;

  const submit = async () => {
    if (!form.siswa_id || !form.tujuan || !form.status) {
      setError("Siswa, tujuan, dan status wajib diisi.");
      return;
    }
    if (form.status === "selesai" && !form.tanda_tangan_ortu) {
      setError("Tanda tangan orang tua wajib jika status selesai.");
      return;
    }
    if (!params?.id) return;
    setSaving(true);
    setError("");
    try {
      await updateHomeVisit(params.id, form);
      router.push(`/home-visit/${params.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.response?.data?.detail ?? "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (!current) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500">Memuat data...</div>;
  }

  if (!canEdit) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500">Akses edit hanya untuk admin dan guru BK.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Home Visit</h1>
            <p className="mt-1 text-sm text-slate-500">Perbarui hasil kunjungan tanpa membuat catatan baru.</p>
          </div>
          <Link href={`/home-visit/${params?.id ?? ""}`} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            Batal
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none" type="date" value={form.tanggal_kunjungan ?? ""} onChange={(e) => setForm({ ...form, tanggal_kunjungan: e.target.value })} />
          <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none" value={form.siswa_id ?? ""} onChange={(e) => setForm({ ...form, siswa_id: e.target.value, alamat: siswa?.alamat ?? "" })}>
            <option value="">Pilih siswa</option>
            {siswaItems.map((item) => <option key={item.id} value={item.id}>{item.nama_lengkap}</option>)}
          </select>
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none" value={kelas?.nama_kelas ?? "-"} disabled />
          <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none" placeholder="Alamat" value={form.alamat ?? ""} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2 outline-none" placeholder="Tujuan" value={form.tujuan ?? ""} onChange={(e) => setForm({ ...form, tujuan: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2 outline-none" placeholder="Hasil observasi" value={form.hasil_observasi ?? ""} onChange={(e) => setForm({ ...form, hasil_observasi: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2 outline-none" placeholder="Kesimpulan" value={form.kesimpulan ?? ""} onChange={(e) => setForm({ ...form, kesimpulan: e.target.value })} />
          <input className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2 outline-none" placeholder="URL foto kunjungan" value={form.foto_kunjungan_url ?? ""} onChange={(e) => setForm({ ...form, foto_kunjungan_url: e.target.value })} />
          <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none" value={form.status ?? "dijadwalkan"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
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

        {form.tanda_tangan_ortu ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <img src={form.tanda_tangan_ortu} alt="Preview tanda tangan orang tua" className="h-32 w-full rounded-xl object-contain" />
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={submit} disabled={saving} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link href={`/home-visit/${params?.id ?? ""}`} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            Batal
          </Link>
        </div>
      </div>
    </div>
  );
}
