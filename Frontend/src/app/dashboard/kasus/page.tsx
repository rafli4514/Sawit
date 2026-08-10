"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { 
  FolderOpen, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Trash2,
  MapPin,
  ChevronLeft,
  Info,
  Search,
  History,
  Activity,
  AlertTriangle,
  ShieldCheck,
  ClipboardList,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useDiagnosis } from "../../context/DiagnosisContext";
import { cn } from "../../components/ui/utils";

const CASES_PER_PAGE = 10;

const severityConfig: Record<string, { label: string; class: string; icon: any }> = {
  low: { label: "Rendah", class: "bg-green-100 text-green-800 border-green-200", icon: Activity },
  medium: { label: "Sedang", class: "bg-amber-100 text-amber-800 border-amber-200", icon: Activity },
  high: { label: "Tinggi", class: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
};

export default function RiwayatKasusPage() {
  const { savedCases, deleteCase, refreshCases, loading: casesLoading } = useDiagnosis();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"Semua" | "Rendah" | "Sedang" | "Tinggi">("Semua");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Data States
  const [apiSymptoms, setApiSymptoms] = useState<any[]>([]);
  const [symptomsLoading, setSymptomsLoading] = useState(true);

  useEffect(() => {
    refreshCases();
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
      setSymptomsLoading(false);
    }
  };

  const loading = casesLoading || symptomsLoading;

  const filteredCases = useMemo(() => {
    return savedCases.filter((c) => {
      const topDiag = c.output.diagnoses[0];
      const severityMap: Record<string, string> = {
        low: "Rendah",
        medium: "Sedang",
        high: "Tinggi"
      };
      
      const matchSearch = c.caseId.toLowerCase().includes(search.toLowerCase()) || 
                         (topDiag?.diseaseName.toLowerCase() || "").includes(search.toLowerCase()) ||
                         (c.metadata.plotId || "").toLowerCase().includes(search.toLowerCase());
      
      const matchSeverity = filter === "Semua" || (topDiag && severityMap[topDiag.severity] === filter);
      
      return matchSearch && matchSeverity;
    });
  }, [savedCases, search, filter]);

  const totalPages = Math.ceil(filteredCases.length / CASES_PER_PAGE);
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * CASES_PER_PAGE;
    return filteredCases.slice(start, start + CASES_PER_PAGE);
  }, [filteredCases, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const getSymptomNames = (symptomInputs: { symptomId: number }[]) => {
    if (symptomInputs.length === 0) return "Gejala umum";
    return symptomInputs
      .map(input => apiSymptoms.find(s => s.id === input.symptomId)?.nama)
      .filter(Boolean)
      .join(", ");
  };

  if (loading && savedCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 bg-slate-50/50">
        <Loader2 className="h-12 w-12 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat riwayat...</p>
      </div>
    );
  }

  if (savedCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 bg-slate-50/50">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-[#8DC63F]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
          <div className="relative h-28 w-28 bg-white rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-xl shadow-slate-200/50 rotate-3 group-hover:-rotate-3 transition-transform duration-500">
            <FolderOpen className="h-12 w-12 text-[#006837]" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Riwayat Masih Kosong</h2>
        <p className="text-slate-500 text-base mb-10 max-w-md leading-relaxed">
          Sistem belum menemukan catatan diagnosis sebelumnya. Mari mulai analisis kesehatan kebun sawit Anda sekarang.
        </p>
        <Button 
          onClick={() => router.push("/dashboard/gejala")} 
          className="h-14 bg-[#006837] hover:bg-[#004d2c] text-white px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-900/10 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" /> Mulai Diagnosis Baru
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#006837] rounded-xl flex items-center justify-center shadow-md shadow-green-900/10">
              <History className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Riwayat <span className="text-[#006837]">Kasus.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => refreshCases()}
              disabled={loading}
              className="h-10 rounded-xl px-4 border-slate-200 text-slate-500 hover:text-[#006837] transition-all"
            >
              <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button 
              onClick={() => router.push("/dashboard/gejala")} 
              className="h-10 bg-[#006837] hover:bg-[#004d2c] text-white px-5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md shadow-green-900/10 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 mr-2" /> Diagnosa Baru
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Cari ID kasus, penyakit, atau plot..." 
              className="pl-11 h-10 rounded-lg border-slate-50 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs text-slate-700" 
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {(["Semua", "Rendah", "Sedang", "Tinggi"] as const).map((label) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all font-black uppercase tracking-widest text-[9px] border ${
                  filter === label 
                    ? "bg-[#006837] text-white border-[#006837] shadow-md shadow-green-900/10" 
                    : "bg-white text-slate-400 border-slate-50 hover:border-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pl-6">Tanggal</TableHead>
                  <TableHead className="w-[100px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">ID Kasus</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Diagnosis Utama</TableHead>
                  <TableHead className="w-[200px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Gejala Terdeteksi</TableHead>
                  <TableHead className="w-[100px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Akurasi</TableHead>
                  <TableHead className="w-[120px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Keparahan</TableHead>
                  <TableHead className="w-[100px] text-right font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <p className="font-black uppercase tracking-widest text-[10px] text-slate-300">Hasil tidak ditemukan</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCases.map((diagCase) => {
                    const topDiag = diagCase.output.diagnoses[0];
                    const sev = topDiag ? severityConfig[topDiag.severity as keyof typeof severityConfig] : severityConfig.medium;

                    return (
                      <TableRow key={diagCase.caseId} className="group hover:bg-slate-50/30 transition-all">
                        <TableCell className="py-4 pl-6">
                          <span className="font-bold text-slate-900 text-sm">
                            {new Date(diagCase.output.timestamp).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <code className="text-[10px] font-black font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            {diagCase.caseId.slice(0, 8)}
                          </code>
                        </TableCell>
                        <TableCell className="py-4">
                          {topDiag ? (
                            <span className="font-bold text-slate-900 text-sm leading-tight">
                              {topDiag.diseaseName}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-xs">Tidak ada diagnosis</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-[200px]">
                            {getSymptomNames(diagCase.output.inputs)}
                          </p>
                        </TableCell>
                        <TableCell className="py-4">
                          {topDiag ? (
                            <span className="text-[10px] font-black text-[#8DC63F]">
                              {topDiag.cfPercent}%
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={cn("text-[8px] px-2 py-0.5 border font-black uppercase tracking-widest rounded-md", sev.class)}>
                            {sev.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-[#006837] hover:bg-green-50 transition-all"
                              onClick={() => router.push(`/dashboard/hasil/${diagCase.caseId}`)}
                              title="Lihat Detail"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                            
                            <div className="w-px h-4 bg-slate-100 mx-1" />

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                              onClick={() => setDeleteId(diagCase.caseId)}
                              title="Hapus Riwayat"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Global Delete Alert Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-xl">Hapus Riwayat?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Kasus <span className="font-mono font-bold text-slate-900">{deleteId?.slice(0, 8)}</span> akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl h-10 text-xs font-bold">Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={async () => {
                  if (deleteId) {
                    await deleteCase(deleteId);
                    setDeleteId(null);
                  }
                }} 
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 text-xs font-bold"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total <span className="text-slate-900 font-black">{filteredCases.length}</span> Kasus
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg border-slate-100 text-slate-400 hover:text-[#006837] disabled:opacity-20"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[10px] font-black text-slate-900 w-8 text-center">{currentPage}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg border-slate-100 text-slate-400 hover:text-[#006837] disabled:opacity-20"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
