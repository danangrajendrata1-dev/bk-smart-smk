"use client";

import type { ComponentType } from "react";
import { LayoutGrid, Laptop, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLayoutMode, type LayoutMode } from "@/hooks/useLayoutMode";

const options: { value: LayoutMode; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { value: "auto", label: "Tampilan Otomatis", icon: LayoutGrid },
  { value: "mobile", label: "Tampilan Mobile", icon: Smartphone },
  { value: "desktop", label: "Tampilan Desktop", icon: Laptop },
];

export default function LayoutModeSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { mode, setMode } = useLayoutMode();

  const handleChange = (nextMode: LayoutMode) => {
    setMode(nextMode);
    router.refresh();
  };

  return (
    <div className={compact ? "w-full" : "min-w-48"}>
      <label className="block text-xs font-medium text-slate-500">Mode tampilan</label>
      <select
        value={mode}
        onChange={(e) => handleChange(e.target.value as LayoutMode)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
