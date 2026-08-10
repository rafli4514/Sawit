import { useState } from "react";
import { AlertTriangle, X, Phone } from "lucide-react";
import type { DiagnosisResult } from "../../engine/types";

interface Props {
  diagnoses: DiagnosisResult[];
}

export function EmergencyBanner({ diagnoses }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const highDiag = diagnoses.filter((d) => d.severity === "high" && d.cfScore >= 0.7);
  if (highDiag.length === 0) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-4" role="alert">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-lg">⚠ DARURAT — Kondisi Tingkat Tinggi Terdeteksi</p>
              <p className="text-red-100 text-sm mt-1">
                {highDiag.map((d) => d.diseaseName).join(", ")} (CF {Math.max(...highDiag.map((d) => d.cfPercent))}%)
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                  <AlertTriangle className="h-3.5 w-3.5" /> Isolasi Blok Segera
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors border border-red-400">
                  <Phone className="h-3.5 w-3.5" /> Hubungi Pakar
                </button>
              </div>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="flex-shrink-0 p-1 hover:bg-red-700 rounded" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
