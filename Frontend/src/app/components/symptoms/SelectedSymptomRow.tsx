import { X } from "lucide-react";
import type { Symptom } from "../../engine/types";
import { CERTAINTY_TERMS } from "../../engine/types";

interface Props {
  symptom: Symptom;
  confidence: number; // Nilai CF user: -0.25, 0, 0.3, 0.5, 0.7
  onConfidenceChange: (id: number, value: number) => void;
  onRemove: (id: number) => void;
}

export function SelectedSymptomRow({ symptom, confidence, onConfidenceChange, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 bg-white shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {symptom.imageUrl ? (
            <img
              src={symptom.imageUrl}
              alt={symptom.label}
              className="h-10 w-10 object-cover rounded-lg flex-shrink-0 border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm">
              🌿
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 leading-tight truncate">
              {symptom.code} - {symptom.label}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">{symptom.category}</span>
          </div>
        </div>
        <button
          onClick={() => onRemove(symptom.id)}
          className="flex-shrink-0 p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label={`Hapus ${symptom.label}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Certainty Term Selector */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          Tingkat Keyakinan (CF User)
        </label>
        <select
          value={confidence}
          onChange={(e) => onConfidenceChange(symptom.id, Number(e.target.value))}
          className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006837] focus:bg-white transition-all"
        >
          {CERTAINTY_TERMS.map((term) => (
            <option key={term.value} value={term.value}>
              {/* {term.label} ({term.value >= 0 ? `+${term.value}` : term.value}) */}
              {term.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
