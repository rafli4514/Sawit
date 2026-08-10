"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Leaf, 
  Trash2, 
  AlertCircle, 
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SymptomCard } from "../../components/symptoms/SymptomCard";
import { SelectedSymptomRow } from "../../components/symptoms/SelectedSymptomRow";
import { useDiagnosis } from "../../context/DiagnosisContext";
import { useAuth } from "../../context/AuthContext";
import { mockSymptoms as fallbackSymptoms, mockDiseases, mockRules } from "../../data/mockData";
import { runDiagnosis } from "../../engine/cfEngine";
import type { Symptom, SymptomCategory } from "../../engine/types";
import { toast } from "sonner";

const categories: (SymptomCategory | "Semua")[] = ["Semua", "Daun", "Batang", "Akar", "Pucuk", "Buah"];
const ITEMS_PER_PAGE = 12;

export default function GejalaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedSymptoms, addSymptom, removeSymptom, setConfidence, clearSymptoms, saveCase, setLastResult } = useDiagnosis();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<SymptomCategory | "Semua">("Semua");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiSymptoms, setApiSymptoms] = useState<Symptom[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch("/api/gejala");
      if (!response.ok) throw new Error("Gagal ambil data");
      const data = await response.json();
      
      // Map API data to Symptom interface
      // Prioritaskan imageUrl dari DB, baru fallback ke mock data
      const mapped = data.map((gs: any) => {
        const fallback = fallbackSymptoms.find(s => s.code === gs.kode);
        return {
          id: gs.id,
          code: gs.kode,
          label: gs.nama,
          description: fallback?.description || "Gejala kelapa sawit.",
          category: fallback?.category || "Daun",
          severityHint: fallback?.severityHint || "medium",
          active: true,
          imageUrl: gs.imageUrl || fallback?.imageUrl || undefined  // DB imageUrl diutamakan
        };
      });
      
      setApiSymptoms(mapped);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      toast.error("Gagal mengambil data gejala dari server. Menggunakan data lokal.");
      setApiSymptoms(fallbackSymptoms);
    } finally {
      setFetching(false);
    }
  };

  const filteredSymptoms = useMemo(() => {
    return apiSymptoms.filter((s) => {
      const matchCat = activeCategory === "Semua" || s.category === activeCategory;
      const matchSearch = s.label.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase()) ||
                          s.code.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch && s.active;
    });
  }, [search, activeCategory, apiSymptoms]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredSymptoms.length / ITEMS_PER_PAGE);
  const currentSymptoms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSymptoms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSymptoms, currentPage]);

  const selectedIds = new Set(selectedSymptoms.map((s) => s.symptomId));

  const handleToggle = (id: number) => {
    if (selectedIds.has(id)) {
      removeSymptom(id);
    } else {
      addSymptom(id);
      toast.success("Gejala ditambahkan", {
        description: apiSymptoms.find(s => s.id === id)?.label,
        duration: 1500,
      });
    }
  };

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Pilih minimal satu gejala");
      return;
    }
    setLoading(true);

    try {
      // Use the API for diagnosis if possible, otherwise fallback to local engine
      const response = await fetch("/api/diagnosa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          symptoms: selectedSymptoms
        })
      });

      if (response.ok) {
        const result = await response.json();
        setLastResult(result);
        toast.success("Diagnosis selesai");
        router.push(`/dashboard/hasil/${result.caseId}`);
      } else {
        // Fallback to client-side engine if API fails
        const result = runDiagnosis(selectedSymptoms, mockRules, mockDiseases);
        setLastResult(result);
        if (user) {
          saveCase(result, { plotId: "Umum", notes: "-", timestamp: new Date().toISOString() }, user.id, user.nama || user.name || "User");
        }
        router.push(`/dashboard/hasil/${result.caseId}`);
      }
    } catch (error) {
      console.error("Diagnosis error:", error);
      const result = runDiagnosis(selectedSymptoms, mockRules, mockDiseases);
      setLastResult(result);
      router.push(`/dashboard/hasil/${result.caseId}`);
    } finally {
      setLoading(false);
    }
  };

  const symptomById = (id: number) => apiSymptoms.find((s) => s.id === id)!;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header */}
      <header className="p-8 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Identifikasi <span className="text-[#006837]">Gejala</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Pilih tanda-tanda kerusakan yang terlihat di lapangan.</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Catalog */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search & Filter - Minimalist */}
            <div className="flex flex-col gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#006837] transition-colors" />
                <Input 
                  value={search} 
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
                  placeholder="Cari gejala visual..." 
                  className="pl-11 h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium" 
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                    className={`whitespace-nowrap px-4 py-2 text-[10px] rounded-lg transition-all font-bold uppercase tracking-wider border ${
                      activeCategory === cat 
                        ? "bg-[#006837] text-white border-[#006837]" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Symptoms */}
            {fetching ? (
              <div className="text-center py-24">
                <Loader2 className="h-8 w-8 text-[#006837] animate-spin mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat data gejala...</p>
              </div>
            ) : currentSymptoms.length === 0 ? (
              <div className="text-center py-24 border border-dashed rounded-2xl bg-slate-50/50">
                <Leaf className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tidak ada hasil</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentSymptoms.map((symptom) => (
                  <SymptomCard 
                    key={symptom.id}
                    symptom={symptom} 
                    selected={selectedIds.has(symptom.id)} 
                    onToggle={handleToggle} 
                  />
                ))}
              </div>
            )}

            {/* Simple Pagination */}
            {!fetching && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-8">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-lg h-9 w-9 border-slate-100"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Halaman {currentPage} / {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-lg h-9 w-9 border-slate-100"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Review - Simplified */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="border border-slate-100 rounded-2xl bg-slate-50/30 flex flex-col p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-black uppercase tracking-wider">Review Pilihan</h2>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                  {selectedSymptoms.length} ITEM
                </span>
              </div>

              <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedSymptoms.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Belum ada <br /> gejala dipilih
                    </p>
                  </div>
                ) : (
                  selectedSymptoms.map(({ symptomId, userConfidence }) => {
                    const s = symptomById(symptomId);
                    if (!s) return null;
                    return (
                      <SelectedSymptomRow
                        key={symptomId}
                        symptom={s}
                        confidence={userConfidence}
                        onConfidenceChange={setConfidence}
                        onRemove={removeSymptom}
                      />
                    );
                  })
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {selectedSymptoms.length > 0 && (
                  <button 
                    onClick={clearSymptoms}
                    className="w-full text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> Bersihkan
                  </button>
                )}

                <Button 
                  onClick={handleDiagnose}
                  disabled={selectedSymptoms.length === 0 || loading}
                  className="w-full h-12 bg-[#006837] hover:bg-[#004d2c] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-[0.98] disabled:opacity-30"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      MEMPROSES...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Mulai Diagnosis <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {mounted && !user && (
                  <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest text-center">
                    <AlertCircle className="h-3 w-3 inline mr-1" /> Login untuk menyimpan
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky - Minimalist */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        <Button 
          onClick={handleDiagnose}
          disabled={selectedSymptoms.length === 0 || loading}
          className="w-full bg-[#006837] text-white h-14 rounded-xl font-bold uppercase tracking-widest shadow-2xl"
        >
          {loading ? "PROSES..." : `DIAGNOSA (${selectedSymptoms.length})`}
        </Button>
      </div>
    </div>
  );
}
