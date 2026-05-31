"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, FileArchive, LayoutDashboard, MessageSquareWarning, MoreHorizontal, School2, Users } from "lucide-react";

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Siswa", href: "/siswa", icon: Users },
  { title: "Pelanggaran", href: "/pelanggaran", icon: MessageSquareWarning },
  { title: "Konseling", href: "/konseling", icon: School2 },
  { title: "Lainnya", href: "/surat-peringatan", icon: MoreHorizontal },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium ${
                active ? "text-blue-700" : "text-slate-500"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-blue-700" : "text-slate-500"}`} />
              <span className="mt-1">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
