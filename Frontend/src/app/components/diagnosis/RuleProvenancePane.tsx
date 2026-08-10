"use client";

import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { DiagnosisResult } from "../../engine/types";

const severityConfig = {
  low: { class: "bg-green-100 text-green-800" },
  medium: { class: "bg-amber-100 text-amber-800" },
  high: { class: "bg-red-100 text-red-800" },
};

interface Props {
  diagnoses: DiagnosisResult[];
  focusDiseaseId?: number | null;
}

export function RuleProvenancePane({ diagnoses, focusDiseaseId }: Props) {
  const [openDiseases, setOpenDiseases] = useState<Set<number>>(new Set([focusDiseaseId ?? diagnoses[0]?.diseaseId]));
  const [openRules, setOpenRules] = useState<Set<number>>(new Set());
  const [apiSymptoms, setApiSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const res = await fetch("/api/gejala");
      if (res.ok) {
        const data = await res.json();
        setApiSymptoms(data);
      }
    } catch (error) {
      console.error("Gagal ambil gejala:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDisease = (id: number) => {
    setOpenDiseases((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };
  const toggleRule = (id: number) => {
    setOpenRules((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const getSymbolLabel = (id: number) => apiSymptoms.find((s) => s.id === id)?.nama ?? `Gejala #${id}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-6 w-6 text-[#006837] animate-spin mb-2" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Memuat Logika...</p>
      </div>
    );
  }

  if (diagnoses.length === 0) return <p className="text-sm text-muted-foreground py-4">Tidak ada data provenance.</p>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Klik penyakit untuk melihat aturan yang aktif dan kontribusi CF-nya.</p>
      {diagnoses.map((diag) => {
        const isOpen = openDiseases.has(diag.diseaseId);
        const sev = severityConfig[diag.severity as keyof typeof severityConfig] || severityConfig.medium;
        return (
          <div key={diag.diseaseId} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDisease(diag.diseaseId)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-2 text-left">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-semibold text-sm">{diag.diseaseName}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${sev.class}`}>{diag.cfPercent}%</span>
              </div>
              <span className="text-xs text-muted-foreground">{diag.rulesTraced.length} aturan aktif</span>
            </button>

            {isOpen && (
              <div className="divide-y">
                {diag.rulesTraced.map((firedRule) => {
                  const isRuleOpen = openRules.has(firedRule.ruleId);
                  return (
                    <div key={firedRule.ruleId}>
                      <button
                        onClick={() => toggleRule(firedRule.ruleId)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-left">
                          {isRuleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{firedRule.ruleCode}</code>
                          <span className="text-sm text-muted-foreground truncate max-w-[200px]">{firedRule.ruleTitle}</span>
                        </div>
                        <span className="text-xs font-mono text-green-700 flex-shrink-0">CF +{(firedRule.cfContribution * 100).toFixed(1)}%</span>
                      </button>

                      {isRuleOpen && (
                        <div className="px-6 pb-3 pt-1 bg-muted/20">
                          <p className="text-xs text-muted-foreground mb-2">Anteseden yang cocok:</p>
                          <div className="space-y-1">
                            {firedRule.antecedentMatches.map((match) => (
                              <div key={match.symptomId} className="flex items-center justify-between text-xs">
                                <span>{getSymbolLabel(match.symptomId)}</span>
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${match.userConfidence * 100}%` }} />
                                  </div>
                                  <span className="font-mono w-10 text-right">{Math.round(match.userConfidence * 100)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
