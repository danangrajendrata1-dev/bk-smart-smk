"use client";

import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function SignaturePad({ value, onChange, disabled = false }: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (value && sigRef.current && sigRef.current.isEmpty()) {
      sigRef.current.fromDataURL(value);
    }
  }, [ready, value]);

  const handleClear = () => {
    sigRef.current?.clear();
    onChange("");
  };

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      onChange("");
      return;
    }
    onChange(sigRef.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">Tanda Tangan Siswa</p>
          <p className="text-xs text-slate-500">Gunakan mouse atau sentuhan di layar sentuh.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleClear} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700" disabled={disabled}>
            Clear
          </button>
          <button type="button" onClick={handleSave} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white" disabled={disabled}>
            Simpan
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
        <SignatureCanvas
          ref={(instance) => {
            sigRef.current = instance;
            if (instance && !ready) setReady(true);
          }}
          canvasProps={{ className: "h-56 w-full touch-none bg-white" }}
          penColor="#0f172a"
        />
      </div>

      {value ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <img src={value} alt="Preview tanda tangan" className="h-28 w-full rounded-xl object-contain" />
        </div>
      ) : null}
    </div>
  );
}
