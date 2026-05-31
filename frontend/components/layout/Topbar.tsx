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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden" type="button" aria-label="Buka menu">
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Dashboard</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
              <CalendarDays className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
