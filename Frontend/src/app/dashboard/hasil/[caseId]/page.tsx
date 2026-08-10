"use client";

import { useParams, useRouter } from "next/navigation";
import { useDiagnosis } from "../../../context/DiagnosisContext";
import { Button } from "../../../components/ui/button";
import { Activity, Clock, ArrowLeft, Printer, RotateCcw, ShieldAlert, Stethoscope, BarChart3, Leaf } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { DiagnosisList } from "../../../components/diagnosis/DiagnosisList";
import { ChartPanel } from "../../../components/diagnosis/ChartPanel";
import { TreatmentAccordion } from "../../../components/diagnosis/TreatmentAccordion";
import { RuleProvenancePane } from "../../../components/diagnosis/RuleProvenancePane";
import { useState, useEffect } from "react";
import { getCertaintyLabel } from "../../../engine/types";

export default function HasilDiagnosisPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const { getCaseById, lastResult } = useDiagnosis();
  const [focusDiseaseId, setFocusDiseaseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("hasil");
  const [symptomMap, setSymptomMap] = useState<Record<number, string>>({});

  const caseId = params?.caseId;
  const diagCase = caseId ? getCaseById(caseId) : null;
  const output = diagCase?.output ?? lastResult;

  // Fetch symptom names from API
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await fetch("/api/gejala");
        if (res.ok) {
          const data = await res.json();
          const map: Record<number, string> = {};
          data.forEach((g: any) => { map[g.id] = g.nama; });
          setSymptomMap(map);
        }
      } catch (e) {
        console.error("Gagal ambil nama gejala:", e);
      }
    };
    fetchSymptoms();
  }, []);

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Laporan Tidak Ditemukan</h2>
        <Button onClick={() => router.push("/dashboard/gejala")} variant="outline" size="sm">
          Diagnosis Baru
        </Button>
      </div>
    );
  }

  const handleProvenanceFocus = (diseaseId: number) => {
    setFocusDiseaseId(diseaseId);
    setActiveTab("provenance");
    document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const topDiagnosis = output.diagnoses[0];
  const formattedDate = new Date(output.timestamp).toLocaleDateString("id-ID", { 
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-sm print:bg-white print:p-0">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-0 print:rounded-none">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-lg print:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Laporan Diagnosis</h1>
            <p className="text-xs text-slate-500">{formattedDate} • ID: {output.caseId.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handlePrint}>
            <Printer className="h-3 w-3 mr-2"/> Cetak
          </Button>
          <Button onClick={() => router.push("/dashboard/gejala")} size="sm" className="h-8 text-white text-xs bg-[#006837] hover:bg-[#004d2c]">
            <RotateCcw className="h-3 w-3 mr-2" /> Ulangi
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-[#006837]" /> Hasil Analisis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6">
                  <TabsTrigger value="hasil" className="text-xs">Temuan</TabsTrigger>
                  <TabsTrigger value="provenance" className="text-xs">Kalkulasi</TabsTrigger>
                </TabsList>
                <div className="p-4">
                  <TabsContent value="hasil"><DiagnosisList diagnoses={output.diagnoses} onViewProvenance={handleProvenanceFocus} /></TabsContent>
                  <TabsContent value="provenance" id="analysis-section"><RuleProvenancePane diagnoses={output.diagnoses} focusDiseaseId={focusDiseaseId} /></TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-4 w-4 text-[#006837]" /> Panduan Penanganan</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <TreatmentAccordion diagnoses={output.diagnoses} />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 sticky top-6">
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Leaf className="h-4 w-4 text-[#8DC63F]" /> Gejala Terpilih</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {output.inputs.map((input) => (
                <div key={input.symptomId} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg gap-2">
                  <span className="font-medium text-slate-700 leading-snug">
                    {symptomMap[input.symptomId] 
                      ? symptomMap[input.symptomId] 
                      : <span className="text-slate-400 italic">Gejala #{input.symptomId}</span>
                    }
                  </span> 
                  <Badge variant="secondary" className="shrink-0 font-bold bg-[#006837]/10 text-[#006837]">
                    {getCertaintyLabel(input.userConfidence)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#8DC63F]" /> Visualisasi Keyakinan</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartPanel diagnoses={output.diagnoses} />
            </CardContent>
          </Card>
        </aside>

      </div>
    </div>
  );
}
