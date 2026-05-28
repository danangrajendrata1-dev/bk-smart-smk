"use client";

import { Bell, CalendarDays, Menu } from "lucide-react";
import { useEffect, useState } from "react";

import type { User } from "@/types/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const [today, setToday] = useState("");

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

  return (
    <header className="sticky top-0 z-10 border-b border-blue-700/30 bg-blue-700 px-4 py-3 text-white shadow-sm lg:border-slate-200 lg:bg-slate-50/95 lg:text-slate-900 lg:backdrop-blur lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-white/10 p-2 text-white lg:hidden" type="button" aria-label="Buka menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="leading-tight">
            <h2 className="text-lg font-semibold sm:text-xl lg:text-slate-900">Dashboard</h2>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-blue-100 sm:text-sm lg:text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <button className="relative rounded-full bg-white/10 p-2 text-white lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:text-slate-600">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-blue-700 lg:ring-white" />
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
