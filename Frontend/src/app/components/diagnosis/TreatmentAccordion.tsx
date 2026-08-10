"use client";

import { AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import type { DiagnosisResult, Disease } from "../../engine/types";

const severityConfig = {
  low: { label: "Rendah", class: "bg-green-100 text-green-800" },
  medium: { label: "Sedang", class: "bg-amber-100 text-amber-800" },
  high: { label: "Tinggi", class: "bg-red-100 text-red-800" },
};

interface Props {
  diagnoses: DiagnosisResult[];
}

export function TreatmentAccordion({ diagnoses }: Props) {
  const [apiDiseases, setApiDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const res = await fetch("/api/penyakit");
      if (res.ok) {
        const data = await res.json();
        setApiDiseases(data);
      }
    } catch (error) {
      console.error("Gagal ambil penyakit:", error);
    } finally {
      setLoading(false);
    }
  };

  if (diagnoses.length === 0) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-[#006837] animate-spin mb-2" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Menyiapkan Solusi...</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={[`item-0`]}>
      {diagnoses.map((diag, i) => {
        const diseaseInfo = apiDiseases.find((d) => d.id === diag.diseaseId);
        const sev = severityConfig[diag.severity as keyof typeof severityConfig] || severityConfig.medium;

        return (
          <AccordionItem key={diag.diseaseId} value={`item-${i}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <span className="font-semibold">{diag.diseaseName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sev.class}`}>{sev.label}</span>
                <span className="text-muted-foreground text-sm">— CF {diag.cfPercent}%</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                {/* Description */}
                {diseaseInfo?.deskripsi && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tentang Penyakit</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{diseaseInfo.deskripsi}</p>
                  </div>
                )}

                {/* Solution */}
                <div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006837]" />
                    Langkah Penanganan
                  </p>
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {diseaseInfo?.solusi || "Hubungi ahli agronomi terdekat untuk penanganan lebih lanjut."}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Catatan Keamanan
                  </p>
                  <p className="text-xs text-amber-700">Gunakan alat pelindung diri (APD) lengkap sebelum melakukan aplikasi bahan kimia di lapangan.</p>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  * Rekomendasi ini berasal dari basis pengetahuan sistem. Selalu konsultasikan dengan agronomis sebelum pengambilan keputusan besar.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

// Helper icon not imported before
import { CheckCircle2 } from "lucide-react";
