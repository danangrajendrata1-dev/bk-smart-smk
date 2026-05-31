"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, CalendarDays, FileText, School2, Users } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

const summaryCards = [
  { title: "Total Siswa", value: "1.250", note: "Siswa aktif", icon: Users, tone: "blue" },
  { title: "Terlambat Hari Ini", value: "18", note: "Siswa", icon: CalendarDays, tone: "yellow" },
  { title: "Pelanggaran Hari Ini", value: "7", note: "Kasus", icon: AlertTriangle, tone: "red" },
  { title: "Konseling Hari Ini", value: "5", note: "Siswa", icon: School2, tone: "green" },
];

const lineData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 32 },
  { name: "Mar", value: 28 },
  { name: "Apr", value: 48 },
  { name: "Mei", value: 30 },
  { name: "Jun", value: 58 },
];

const attendanceData = [
  { name: "Hadir", value: 80, color: "#22c55e" },
  { name: "Izin", value: 8, color: "#f59e0b" },
  { name: "Sakit", value: 4, color: "#ef4444" },
  { name: "Alfa", value: 8, color: "#94a3b8" },
];

const priorityStudents = [
  { name: "Dimas Maulana", className: "XI TKJ 1", badge: "SP2", point: 80 },
  { name: "Aldi Setiawan", className: "X TKR 2", badge: "SP1", point: 55 },
  { name: "Riko Pratama", className: "XI TSM 1", badge: "SP1", point: 45 },
  { name: "Farhan Nabil", className: "X TKJ 2", badge: "Pembinaan", point: 35 },
];

const schedule = [
  { time: "09:00", student: "Ahmad Fauzi", className: "X TKJ 1", counselor: "Siti Nurhaliza, S.Pd" },
  { time: "10:00", student: "Dewi Lestari", className: "XI AKL 2", counselor: "Siti Nurhaliza, S.Pd" },
  { time: "11:00", student: "Budi Setiawan", className: "X TKR 1", counselor: "Siti Nurhaliza, S.Pd" },
  { time: "13:00", student: "Rani Putri", className: "XI MPLB 1", counselor: "Siti Nurhaliza, S.Pd" },
  { time: "14:00", student: "Yoga Pratama", className: "X TSM 2", counselor: "Siti Nurhaliza, S.Pd" },
];

const quickLinks = [
  { title: "Presensi", href: "/presensi", icon: CalendarDays },
  { title: "Pelanggaran", href: "/pelanggaran", icon: AlertTriangle },
  { title: "Konseling", href: "/konseling", icon: FileText },
  { title: "Surat Peringatan", href: "/surat-peringatan", icon: FileText },
  { title: "Pemanggilan Orang Tua", href: "/pemanggilan-ortu", icon: Users },
  { title: "Laporan", href: "/laporan", icon: School2 },
  { title: "Arsip Dokumen", href: "/arsip", icon: FileText },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const iconTone =
            card.tone === "blue" ? "bg-blue-100 text-blue-600" :
            card.tone === "yellow" ? "bg-amber-100 text-amber-600" :
            card.tone === "red" ? "bg-red-100 text-red-600" :
            "bg-emerald-100 text-emerald-600";

          return (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <div className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</div>
                  <p className="mt-1 text-sm text-slate-500">{card.note}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconTone}`}>
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Grafik Pelanggaran Bulanan</h3>
              <p className="text-sm text-slate-500">Data dummy sementara menunggu endpoint dashboard.</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#chartFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Siswa Prioritas</h3>
              <p className="text-sm text-slate-500">Daftar siswa dengan perhatian khusus.</p>
            </div>
            <Link href="/siswa" className="text-sm font-medium text-blue-700">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-4">
            {priorityStudents.map((student) => (
              <div key={student.name} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                    {student.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.className}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    student.badge === "SP2" ? "bg-red-500" : student.badge === "SP1" ? "bg-orange-500" : "bg-emerald-500"
                  }`}>{student.badge}</span>
                  <p className="mt-2 text-sm text-slate-600">Total Poin: {student.point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Rekap Presensi Hari Ini</h3>
          <div className="mt-4 flex items-center gap-6">
            <div className="h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendanceData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {attendanceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-sm">
              {attendanceData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="w-16 text-slate-600">{item.name}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Jadwal Konseling Hari Ini</h3>
              <p className="text-sm text-slate-500">Agenda yang sudah terjadwal.</p>
            </div>
            <Link href="/konseling" className="text-sm font-medium text-blue-700">
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
              <tbody>
                {schedule.map((item) => (
                  <tr key={`${item.time}-${item.student}`} className="border-t border-slate-100 first:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.time}</td>
                    <td className="px-4 py-3 text-slate-700">{item.student}</td>
                    <td className="px-4 py-3 text-slate-500">{item.className}</td>
                    <td className="px-4 py-3 text-slate-500">{item.counselor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Pintasan Modul</h3>
            <p className="text-sm text-slate-500">Akses cepat ke modul yang sering dipakai.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-5 text-center transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Icon className="h-6 w-6 text-slate-700" />
                <span className="mt-3 text-sm font-medium text-slate-700">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
