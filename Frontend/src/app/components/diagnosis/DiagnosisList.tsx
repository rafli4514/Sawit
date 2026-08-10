import { ChevronDown } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import type { DiagnosisResult } from "../../engine/types";

const severityConfig = {
  low: { label: "Rendah", class: "bg-green-100 text-green-800 border-green-200" },
  medium: { label: "Sedang", class: "bg-amber-100 text-amber-800 border-amber-200" },
  high: { label: "Tinggi", class: "bg-red-100 text-red-800 border-red-200" },
};

const rankColors = ["bg-yellow-400", "bg-slate-300", "bg-orange-400"];

interface Props {
  diagnoses: DiagnosisResult[];
  onViewProvenance?: (diseaseId: number) => void;
}

export function DiagnosisList({ diagnoses, onViewProvenance }: Props) {
  if (diagnoses.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="font-medium">Tidak ada diagnosis yang dihasilkan</p>
        <p className="text-sm mt-1">Coba tambah lebih banyak gejala atau naikkan tingkat kepercayaan</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {diagnoses.map((diag, i) => {
        const sev = severityConfig[diag.severity];
        const rankColor = rankColors[i] ?? "bg-slate-200";
        return (
          <div key={diag.diseaseId} className={`rounded-xl border p-4 bg-card ${diag.severity === "high" && diag.cfPercent >= 70 ? "border-red-200 bg-red-50/30" : ""}`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${rankColor} text-white font-bold text-sm flex-shrink-0`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-base leading-tight">{diag.diseaseName}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sev.class}`}>{sev.label}</span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Faktor Kepastian (CF)</span>
                    <span className="font-bold text-base">{diag.cfPercent}%</span>
                  </div>
                  <Progress
                    value={diag.cfPercent}
                    className={`h-2.5 ${diag.severity === "high" ? "[&>div]:bg-red-500" : diag.severity === "medium" ? "[&>div]:bg-amber-500" : "[&>div]:bg-green-500"}`}
                  />
                </div>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    {diag.rulesTraced.length} aturan aktif
                  </span>
                  {onViewProvenance && (
                    <button
                      onClick={() => onViewProvenance(diag.diseaseId)}
                      className="flex items-center gap-1 text-xs text-green-700 hover:text-green-800 font-medium"
                    >
                      Lihat provenance <ChevronDown className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
