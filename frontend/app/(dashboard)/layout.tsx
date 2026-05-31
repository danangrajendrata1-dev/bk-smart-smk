"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Topbar from "@/components/layout/Topbar";
import { useLayoutMode } from "@/hooks/useLayoutMode";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const { mode, isForceDesktop, isForceMobile } = useLayoutMode();

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
    <div className={`min-h-screen bg-slate-100 ${isForceDesktop ? "overflow-x-auto" : ""}`}>
      {(mode === "auto" || isForceDesktop) && <Sidebar />}
      <main className={`min-h-screen ${isForceDesktop ? "min-w-[1024px] pl-[260px]" : isForceMobile ? "" : "lg:pl-[260px]"}`}>
        <Topbar />
        <div className={`p-4 pb-24 sm:p-6 ${isForceDesktop ? "lg:pb-6" : ""}`}>{children}</div>
      </main>
      {!isForceDesktop ? <MobileNav /> : null}
    </div>
  );
}
