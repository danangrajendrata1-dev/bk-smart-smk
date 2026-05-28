"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookText,
  CalendarCheck2,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  School2,
  Settings,
  ShieldAlert,
  Users,
  UserRoundCog,
  ClipboardCheck,
  Home,
  FileArchive,
  BellRing,
} from "lucide-react";

import { logout } from "@/services/authService";
import { roleAccess } from "@/lib/roleAccess";
import type { Role } from "@/types/auth";

const menus = [
  { title: "Dashboard", href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { title: "Data Siswa", href: "/siswa", key: "siswa", icon: Users },
  { title: "Data Kelas", href: "/kelas", key: "kelas", icon: School2 },
  { title: "Presensi", href: "/presensi", key: "presensi", icon: CalendarCheck2 },
  { title: "Master Pelanggaran", href: "/master-pelanggaran", key: "master_pelanggaran", icon: ShieldAlert },
  { title: "Pelanggaran", href: "/pelanggaran", key: "pelanggaran", icon: MessageSquareWarning },
  { title: "Konseling", href: "/konseling", key: "konseling", icon: FileText },
  { title: "Daftar Hadir Konseling", href: "/daftar-hadir-konseling", key: "daftar_hadir_konseling", icon: ClipboardCheck },
  { title: "Surat Peringatan", href: "/surat-peringatan", key: "surat_peringatan", icon: BellRing },
  { title: "Pemanggilan Orang Tua", href: "/pemanggilan-ortu", key: "pemanggilan_ortu", icon: Users },
  { title: "Home Visit", href: "/home-visit", key: "home_visit", icon: Home },
  { title: "Arsip Dokumen", href: "/arsip", key: "arsip", icon: FileArchive },
  { title: "Laporan", href: "/laporan", key: "laporan", icon: BookText },
  { title: "User Management", href: "/user-management", key: "user_management", icon: UserRoundCog },
  { title: "Settings", href: "/settings", key: "settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<Role | "">("");
  const [userName, setUserName] = useState("Pengguna");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;
    try {
      const parsed = JSON.parse(rawUser);
      setRole(parsed.role || "");
      setUserName(parsed.full_name || "Pengguna");
    } catch {
      setRole("");
      setUserName("Pengguna");
    }
  }, []);

  const visibleMenus = useMemo(() => {
    const access = role ? roleAccess[role] ?? roleAccess.admin : roleAccess.admin;
    return menus.filter((menu) => access.includes(menu.key));
  }, [role]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[260px] flex-col bg-[#0F2A44] px-4 py-5 text-white shadow-2xl shadow-slate-900/20 lg:flex">
      <div className="rounded-3xl bg-white/5 px-4 py-5 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">BK SMART</h1>
            <p className="text-xs text-blue-100">SMK Nasional</p>
          </div>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
        {visibleMenus.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] transition ${
                active ? "bg-blue-500 text-white shadow-lg shadow-blue-900/30" : "text-slate-100/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold uppercase">
            {userName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="truncate text-xs text-slate-300">{role || "-"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
