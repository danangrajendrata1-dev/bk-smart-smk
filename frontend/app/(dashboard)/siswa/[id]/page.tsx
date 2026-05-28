"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getSiswaProfile, getSiswaRekomendasiSp, getRiwayatPelanggaranSiswa } from "@/services/siswaService";
import { getKelas } from "@/services/kelasService";
import type { Kelas } from "@/types/kelas";
import type { SiswaProfile } from "@/types/siswa";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<SiswaProfile | null>(null);
  const [kelasItems, setKelasItems] = useState<Kelas[]>([]);
  const [rekomendasiSp, setRekomendasiSp] = useState<string | null>(null);
  const [riwayatPelanggaran, setRiwayatPelanggaran] = useState<any[]>([]);

  useEffect(() => {
    if (!params?.id) return;
    void getSiswaProfile(params.id).then(setItem);
    void getSiswaRekomendasiSp(params.id).then((data) => setRekomendasiSp(data?.rekomendasi_sp ?? null));
    void getRiwayatPelanggaranSiswa(params.id).then(setRiwayatPelanggaran);
    void getKelas().then(setKelasItems);
  }, [params?.id]);

  const kelas = kelasItems.find((data) => data.id === item?.kelas_id);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Detail Siswa</h1>
        <p className="mt-1 text-sm text-slate-500">Profil siswa dan ringkasan riwayat.</p>
      </div>

      {item ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-xs text-slate-500">Nama Lengkap</p><p className="font-medium text-slate-900">{item.nama_lengkap}</p></div>
              <div><p className="text-xs text-slate-500">NIS / NISN</p><p className="font-medium text-slate-900">{item.nis} / {item.nisn ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Kelas</p><p className="font-medium text-slate-900">{kelas?.nama_kelas ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Jurusan</p><p className="font-medium text-slate-900">{item.jurusan ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Kontak Siswa</p><p className="font-medium text-slate-900">{item.no_hp_siswa ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Kontak Ortu</p><p className="font-medium text-slate-900">{item.no_wa_ortu ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Status Siswa</p><p className="font-medium text-slate-900">{item.status_siswa ?? "-"}</p></div>
              <div><p className="text-xs text-slate-500">Alamat</p><p className="font-medium text-slate-900">{item.alamat ?? "-"}</p></div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Total Poin</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{item.total_poin ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Pembinaan</p>
              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{item.status_pembinaan ?? "-"}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Riwayat Pelanggaran</p>
              <div className="mt-2 space-y-2">
                {riwayatPelanggaran.length ? riwayatPelanggaran.map((pelanggaran) => (
                  <div key={pelanggaran.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    {pelanggaran.detail_pelanggaran ?? "-" } - {pelanggaran.poin} poin
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada pelanggaran.</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">Riwayat Konseling</p>
                {item.id ? (
                  <Link href={`/konseling/create?siswa_id=${item.id}`} className="text-xs font-medium text-slate-600 hover:text-slate-900">
                    Tambah konseling
                  </Link>
                ) : null}
              </div>
              <div className="mt-2 space-y-2">
                {item.riwayat_konseling?.length ? item.riwayat_konseling.map((konseling) => (
                  <div key={konseling.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900">{konseling.tanggal} - {konseling.jenis_konseling}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{konseling.status}</span>
                    </div>
                    <p className="mt-1 text-slate-600">{konseling.permasalahan}</p>
                    {konseling.jadwal_berikutnya ? (
                      <p className="mt-1 text-xs text-slate-500">Jadwal berikutnya: {konseling.jadwal_berikutnya}</p>
                    ) : null}
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada riwayat konseling.</p>}
              </div>
              <div className="mt-2 grid gap-2 text-xs text-slate-500">
                <div>Jumlah konseling: {item.jumlah_konseling ?? 0}</div>
                <div>Jadwal berikutnya: {item.jadwal_konseling_berikutnya ?? "-"}</div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Riwayat Hadir Konseling</p>
              <div className="mt-2 space-y-2">
                {item.riwayat_hadir_konseling?.length ? item.riwayat_hadir_konseling.map((hadir) => (
                  <div key={hadir.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900">{hadir.tanggal}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{hadir.status_hadir}</span>
                    </div>
                    <p className="mt-1 text-slate-600">Waktu hadir: {hadir.waktu_hadir ?? "-"}</p>
                    {hadir.catatan ? <p className="mt-1 text-xs text-slate-500">{hadir.catatan}</p> : null}
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada riwayat hadir konseling.</p>}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Rekomendasi SP</p>
              <p className="mt-2 text-sm text-slate-500">{rekomendasiSp ?? item.rekomendasi_sp ?? "-"}</p>
              {rekomendasiSp || item.rekomendasi_sp ? (
                <Link href={`/surat-peringatan/create?siswa_id=${item.id}`} className="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  Buat SP
                </Link>
              ) : null}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Riwayat Surat Peringatan</p>
              <div className="mt-2 space-y-2">
                {item.riwayat_surat_peringatan?.length ? item.riwayat_surat_peringatan.map((sp) => (
                  <div key={sp.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900">{sp.nomor_surat}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{sp.jenis_sp}</span>
                    </div>
                    <p className="mt-1 text-slate-600">{sp.alasan_sp}</p>
                    {sp.file_pdf_url ? <a className="mt-2 inline-block text-xs text-slate-700 underline" href={sp.file_pdf_url}>Download PDF</a> : null}
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada surat peringatan.</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">Pemanggilan Orang Tua</p>
                {item.id ? <Link href={`/pemanggilan-ortu/create?siswa_id=${item.id}`} className="text-xs font-medium text-slate-600">Tambah</Link> : null}
              </div>
              <div className="mt-2 space-y-2">
                {item.riwayat_pemanggilan_ortu?.length ? item.riwayat_pemanggilan_ortu.map((entry) => (
                  <div key={entry.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900">{entry.tanggal}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{entry.status}</span>
                    </div>
                    <p className="mt-1 text-slate-600">{entry.alasan_pemanggilan}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada pemanggilan orang tua.</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">Home Visit</p>
                {item.id ? <Link href={`/home-visit/create?siswa_id=${item.id}`} className="text-xs font-medium text-slate-600">Tambah</Link> : null}
              </div>
              <div className="mt-2 space-y-2">
                {item.riwayat_home_visit?.length ? item.riwayat_home_visit.map((entry) => (
                  <div key={entry.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900">{entry.tanggal_kunjungan}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{entry.status}</span>
                    </div>
                    <p className="mt-1 text-slate-600">{entry.tujuan}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada home visit.</p>}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Arsip Dokumen</p>
              <div className="mt-2 space-y-2">
                {item.arsip_dokumen?.length ? item.arsip_dokumen.map((arsip) => (
                  <div key={arsip.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900">{arsip.judul_dokumen}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-600">{arsip.jenis_dokumen}</span>
                    </div>
                    {arsip.file_url ? <a href={arsip.file_url.startsWith("http") ? arsip.file_url : `${process.env.NEXT_PUBLIC_API_URL ?? ""}${arsip.file_url}`} className="mt-2 inline-block text-xs text-slate-700 underline" target="_blank" rel="noreferrer">Unduh</a> : null}
                  </div>
                )) : <p className="text-sm text-slate-500">Belum ada arsip dokumen.</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-slate-500">Memuat data siswa...</div>
      )}
    </div>
  );
}
