"use client";

import { Bell, CalendarDays, Menu, PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";

import LayoutModeSwitcher from "@/components/layout/LayoutModeSwitcher";
import { useLayoutMode } from "@/hooks/useLayoutMode";
import type { User } from "@/types/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function DesktopTopbar({ user, today }: { user: User | null; today: string }) {
  return (
    <header className="sticky top-0 z-20 hidden border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:block lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden" type="button" aria-label="Buka menu">
            <PanelLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Dashboard</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LayoutModeSwitcher />
          <button className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-slate-900">{user?.full_name ?? "Pengguna"}</div>
            <div className="text-xs text-slate-500">{user?.role ?? "-"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileTopbar({ today }: { today: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-700 bg-[#1D4ED8] px-4 py-3 text-white lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 text-white/95" type="button" aria-label="Buka menu">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-white">Dashboard</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-blue-100">
              <CalendarDays className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </div>

        <button className="relative rounded-xl p-2 text-white" type="button" aria-label="Notifikasi">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#1D4ED8]" />
        </button>
      </div>
    </header>
  );
}

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const [today, setToday] = useState("");
  const { isForceDesktop, isForceMobile } = useLayoutMode();

  useEffect(() => {
    setToday(formatDate(new Date()));
    if (typeof window === "undefined") return;
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;
    try {
      setUser(JSON.parse(rawUser));
    } catch {
      setUser(null);
    }
  }, []);

  if (isForceDesktop) {
    return <DesktopTopbar user={user} today={today} />;
  }

  if (isForceMobile) {
    return (
      <header className="sticky top-0 z-20 border-b border-blue-700 bg-[#1D4ED8] px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-white/95" type="button" aria-label="Buka menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-white">Dashboard</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-blue-100">
                <CalendarDays className="h-4 w-4" />
                <span>{today}</span>
              </div>
            </div>
          </div>

          <button className="relative rounded-xl p-2 text-white" type="button" aria-label="Notifikasi">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#1D4ED8]" />
          </button>
        </div>
        <div className="mt-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2">
          <LayoutModeSwitcher compact />
        </div>
      </header>
    );
  }

  return (
    <>
      <DesktopTopbar user={user} today={today} />
      <MobileTopbar today={today} />
    </>
  );
}
