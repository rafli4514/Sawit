"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  CheckCircle2, 
  FlaskConical, 
  FileText, 
  Dna, 
  Zap,
  ChevronRight,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../../components/ui/select";
import { Slider } from "../../../../components/ui/slider";
import { simulateSingleRule } from "../../../../engine/cfEngine";
import type { Rule, RuleAntecedent, RuleConsequent, SymptomInput, SimulationResult, Symptom, Disease } from "../../../../engine/types";
import { toast } from "sonner";

export default function BaruAturanPage() {
  const router = useRouter();

  // Data States
  const [apiSymptoms, setApiSymptoms] = useState<Symptom[]>([]);
  const [apiDiseases, setApiDiseases] = useState<Disease[]>([]);
  const [fetching, setFetching] = useState(true);

  // Form States
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [antecedents, setAntecedents] = useState<RuleAntecedent[]>([]);
  const [consequents, setConsequents] = useState<RuleConsequent[]>([]);

  // Sandbox State
  const [sandboxInputs, setSandboxInputs] = useState<SymptomInput[]>([]);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const [gsRes, dsRes] = await Promise.all([
        fetch("/api/gejala"),
        fetch("/api/penyakit")
      ]);
      const symptoms = await gsRes.json();
      const diseases = await dsRes.json();
      setApiSymptoms(symptoms);
      setApiDiseases(diseases);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Gagal mengambil data dari server");
    } finally {
      setFetching(false);
    }
  };

  // Actions
  const addAntecedent = () => {
    if (apiSymptoms.length === 0) return;
    setAntecedents((prev) => [...prev, { symptomId: apiSymptoms[0].id, minConfidence: 0.3 }]);
  };
  const removeAntecedent = (i: number) => setAntecedents((prev) => prev.filter((_, idx) => idx !== i));
  const updateAntecedent = (i: number, field: keyof RuleAntecedent, value: number) =>
    setAntecedents((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a));

  const addConsequent = () => {
    if (apiDiseases.length === 0) return;
    setConsequents((prev) => [...prev, { diseaseId: apiDiseases[0].id, cf: 0.7 }]);
  };
  const removeConsequent = (i: number) => setConsequents((prev) => prev.filter((_, idx) => idx !== i));
  const updateConsequent = (i: number, field: keyof RuleConsequent, value: number) =>
    setConsequents((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));

  const addSandboxInput = () => {
    if (apiSymptoms.length === 0) return;
    setSandboxInputs((prev) => [...prev, { symptomId: apiSymptoms[0].id, userConfidence: 0.5 }]);
  };
  const updateSandboxInput = (i: number, field: keyof SymptomInput, value: number) =>
    setSandboxInputs((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  const removeSandboxInput = (i: number) => setSandboxInputs((prev) => prev.filter((_, idx) => idx !== i));

  const handleSimulate = () => {
    if (antecedents.length === 0 || consequents.length === 0) {
      toast.error("Lengkapi logika aturan terlebih dahulu");
      return;
    }
    const mockRule: Rule = {
      id: 999, code, title, antecedents, consequents, notes,
      active: true, version: 1, status: "draft", createdAt: "", createdBy: "",
    };
    const result = simulateSingleRule(mockRule, sandboxInputs);
    setSimResult(result);
  };

  const handleSave = async (status: "draft" | "published") => {
    if (antecedents.length === 0 || consequents.length === 0) {
      toast.error("Mohon lengkapi data gejala dan penyakit");
      return;
    }

    try {
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          penyakitId: consequents[0].diseaseId,
          gejalaId: antecedents[0].symptomId,
          cfPakar: consequents[0].cf
        })
      });

      if (response.ok) {
        toast.success(`Aturan ${status === "published" ? "diterbitkan" : "disimpan"}`);
        router.push("/dashboard/admin/aturan");
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch (error) {
      toast.error("Gagal menyimpan ke database");
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Menyiapkan Basis Aturan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100">
              <Link href="/dashboard/admin/aturan"><ArrowLeft className="h-5 w-5 text-slate-500" /></Link>
            </Button>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">Aturan Baru</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sistem Manajemen Pengetahuan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => handleSave("draft")}
              variant="outline"
              className="h-10 rounded-lg font-bold uppercase tracking-widest text-[9px] px-5 border-slate-200"
            >
              <Save className="h-4 w-4 mr-2 text-slate-400" /> Simpan Draf
            </Button>
            <Button 
              onClick={() => handleSave("published")} 
              className="h-10 bg-[#006837] hover:bg-[#004d2c] text-white rounded-lg font-black uppercase tracking-widest text-[9px] px-6 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Terbitkan Aturan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Identitas Card */}
            <Card className="rounded-xl border-slate-200 shadow-sm bg-white">
              <CardHeader className="px-6 py-4 border-b border-slate-50 flex flex-row items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-[#006837]" />
                </div>
                <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Identitas Aturan</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Kode Unik *</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Contoh: R-001" className="h-10 rounded-lg border-slate-200 bg-slate-50/30 focus:bg-white font-bold text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Judul Aturan *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Deskripsi logika..." className="h-10 rounded-lg border-slate-200 bg-slate-50/30 focus:bg-white font-bold text-xs" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Gambar Referensi (Upload)</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImageUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="h-14 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white font-bold text-xs pt-4 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#006837] file:text-white hover:file:bg-[#004d2c] cursor-pointer"
                      />
                      <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-[#006837] pointer-events-none transition-colors" />
                    </div>
                    {imageUrl && (
                      <div className="h-14 w-14 rounded-xl border-2 border-green-100 overflow-hidden bg-white flex-shrink-0 shadow-sm relative group">
                        <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                        <button onClick={() => setImageUrl("")} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Catatan Agronomis</Label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border-slate-200 bg-slate-50/30 rounded-lg px-4 py-3 text-xs min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[#8DC63F] font-medium text-slate-600" placeholder="Detail pendukung atau referensi pakar..." />
                </div>
              </CardContent>
            </Card>

            {/* Gejala (Anteseden) Card */}
            <Card className="rounded-xl border-slate-200 shadow-sm bg-white">
              <CardHeader className="px-6 py-4 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-lime-50 flex items-center justify-center">
                    <Dna className="h-4 w-4 text-[#8DC63F]" />
                  </div>
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Gejala (IF)</CardTitle>
                </div>
                <Button onClick={addAntecedent} variant="outline" className="h-8 px-3 rounded-lg font-bold text-[9px] uppercase border-slate-200 hover:bg-slate-50">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah Gejala
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {antecedents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Belum Ada Logika Gejala</p>
                  </div>
                ) : (
                  antecedents.map((ant, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-[#8DC63F]/30 transition-all">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Pilih Gejala</Label>
                          <Select value={String(ant.symptomId)} onValueChange={(v) => updateAntecedent(i, "symptomId", Number(v))}>
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 font-bold text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {apiSymptoms.map((s) => (
                                <SelectItem key={s.id} value={String(s.id)} className="text-[10px]">
                                  <span className="font-mono font-black text-slate-400 mr-2">{s.code}</span> {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Ambang Min.</span>
                            <span className="text-[11px] font-mono font-black text-[#006837]">{Math.round(ant.minConfidence * 100)}%</span>
                          </div>
                          <Slider value={[Math.round(ant.minConfidence * 100)]} min={0} max={100} step={5} onValueChange={([v]) => updateAntecedent(i, "minConfidence", v / 100)} className="flex-1" />
                        </div>
                      </div>
                      <Button onClick={() => removeAntecedent(i)} variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Penyakit (Konsekuen) Card */}
            <Card className="rounded-xl border-slate-200 shadow-sm bg-white">
              <CardHeader className="px-6 py-4 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-amber-500" />
                  </div>
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Hasil Diagnosis (THEN)</CardTitle>
                </div>
                <Button onClick={addConsequent} variant="outline" className="h-8 px-3 rounded-lg font-bold text-[9px] uppercase border-slate-200 hover:bg-slate-50">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah Hasil
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {consequents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Belum Ada Hasil Penyakit</p>
                  </div>
                ) : (
                  consequents.map((cons, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/5 hover:bg-white transition-all shadow-sm">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Target Penyakit</Label>
                          <Select value={String(cons.diseaseId)} onValueChange={(v) => updateConsequent(i, "diseaseId", Number(v))}>
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 font-bold text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {apiDiseases.map((d) => (
                                <SelectItem key={d.id} value={String(d.id)} className="text-[10px]">{d.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2.5 rounded-lg border border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Bobot CF Pakar</span>
                            <span className={cn("text-[11px] font-mono font-black", cons.cf < 0 ? "text-red-500" : "text-[#006837]")}>{cons.cf.toFixed(2)}</span>
                          </div>
                          <Slider value={[Math.round(cons.cf * 100)]} min={-100} max={100} step={5} onValueChange={([v]) => updateConsequent(i, "cf", v / 100)} className="flex-1" />
                        </div>
                      </div>
                      <Button onClick={() => removeConsequent(i)} variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Laboratorium */}
          <div className="lg:col-span-4 sticky top-6 self-start">
            <Card className="rounded-xl border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col max-h-[calc(100vh-80px)]">
              <CardHeader className="px-6 py-5 border-b border-slate-100 bg-[#006837] text-white shrink-0">
                <CardTitle className="text-sm font-black flex items-center gap-2 tracking-widest uppercase">
                  <FlaskConical className="h-4 w-4 text-[#8DC63F]" /> Laboratorium
                </CardTitle>
                <CardDescription className="text-green-100/60 text-[9px] font-medium leading-tight mt-1 uppercase tracking-tight">Simulasi logika aturan real-time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <div className="p-6 space-y-5 flex-1 overflow-y-auto no-scrollbar">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">Test Input</span>
                      <Button onClick={addSandboxInput} variant="ghost" className="h-6 px-2 rounded text-[8px] font-black uppercase hover:bg-slate-100"><Plus className="h-3 w-3 mr-1" /> Tambah</Button>
                    </div>
                    <div className="space-y-2">
                      {sandboxInputs.length === 0 ? (
                        <p className="text-center py-8 text-[9px] text-slate-300 font-bold uppercase tracking-widest bg-slate-50/50 rounded-lg border border-dashed border-slate-200">Kosong</p>
                      ) : (
                        sandboxInputs.map((inp, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2 group transition-all hover:bg-white hover:shadow-sm">
                            <div className="flex items-center justify-between gap-2">
                              <Select value={String(inp.symptomId)} onValueChange={(v) => updateSandboxInput(i, "symptomId", Number(v))}>
                                <SelectTrigger className="h-7 rounded border-transparent bg-white/50 font-bold text-[9px] flex-1 shadow-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {apiSymptoms.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)} className="text-[9px]">{s.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button onClick={() => removeSandboxInput(i)} variant="ghost" size="icon" className="h-5 w-5 text-slate-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Slider value={[Math.round(inp.userConfidence * 100)]} min={0} max={100} step={10} onValueChange={([v]) => updateSandboxInput(i, "userConfidence", v / 100)} className="flex-1 h-3" />
                              <span className="text-[9px] font-mono font-black text-slate-500 w-7 text-right">{Math.round(inp.userConfidence * 100)}%</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {simResult && (
                    <div className={`rounded-xl border p-5 space-y-4 animate-in fade-in zoom-in-95 duration-300 ${simResult.fires ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${simResult.fires ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-red-500 text-white shadow-lg shadow-red-500/20"}`}><Play className="h-4 w-4 fill-current ml-0.5" /></div>
                        <span className={`font-black text-[11px] uppercase tracking-widest ${simResult.fires ? "text-green-800" : "text-red-800"}`}>{simResult.fires ? "Aturan Aktif" : "Terhenti"}</span>
                      </div>
                      {simResult.fires && (
                        <div className="flex items-end justify-between border-t border-green-200/50 pt-3">
                          <div><p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">CF Kontribusi</p><p className="text-2xl font-black text-green-700 leading-none">{(simResult.cfContribution * 100).toFixed(1)}%</p></div>
                          <Zap className="h-5 w-5 text-[#8DC63F] animate-pulse" />
                        </div>
                      )}
                      <div className="space-y-1.5 pt-2 border-t border-black/5">
                        {simResult.antecedentMatches.map((match) => {
                          const ok = match.userConfidence >= match.minConfidence;
                          const s = apiSymptoms.find(s => s.id === match.symptomId);
                          return (
                            <div key={match.symptomId} className="flex items-center justify-between text-[8px] font-bold">
                              <span className="text-slate-500 truncate max-w-[120px]">{s?.label}</span>
                              <div className="flex items-center gap-1 font-mono">
                                <span className={ok ? "text-green-600" : "text-red-600"}>{Math.round(match.userConfidence * 100)}%</span>
                                <ChevronRight className="h-2 w-2 text-slate-300" /><span className="text-slate-400">{Math.round(match.minConfidence * 100)}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                  <Button onClick={handleSimulate} className="w-full h-11 bg-[#006837] hover:bg-[#004d2c] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-green-900/10 transition-all active:scale-[0.98]">Jalankan Tes Logika</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
