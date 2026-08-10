import { Check } from "lucide-react";
import { Badge } from "../ui/badge";
import type { Symptom } from "../../engine/types";

const severityConfig = {
  low: { label: "Rendah", class: "bg-green-100 text-green-800 border-green-200" },
  medium: { label: "Sedang", class: "bg-amber-100 text-amber-800 border-amber-200" },
  high: { label: "Tinggi", class: "bg-red-100 text-red-800 border-red-200" },
};

interface Props {
  symptom: Symptom;
  selected: boolean;
  onToggle: (id: number) => void;
}

export function SymptomCard({ symptom, selected, onToggle }: Props) {
  const sev = severityConfig[symptom.severityHint];

  return (
    <button
      type="button"
      onClick={() => onToggle(symptom.id)}
      className={`relative w-full text-left rounded-xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
        selected ? "border-green-500 bg-green-50 shadow-sm" : "border-border bg-card hover:border-green-300"
      }`}
      aria-pressed={selected}
      aria-label={`${symptom.label} - ${selected ? "dipilih" : "pilih"}`}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {symptom.imageUrl ? (
          <img src={symptom.imageUrl} alt={symptom.label} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
        )}
        {selected && (
          <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center shadow">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sev.class}`}>{sev.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold leading-tight">{symptom.label}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{symptom.category}</p>
      </div>
    </button>
  );
}
