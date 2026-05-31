"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-auto">
      <Sidebar />
      <main className="min-h-screen min-w-[1024px] pl-[260px]">
        <Topbar />
        <div className="p-4 pb-6 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
