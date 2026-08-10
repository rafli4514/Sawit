"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit2, 
  ChevronRight,
  ChevronLeft,
  FileText,
  Activity,
  Archive,
  Trash2,
  Layers,
  CheckCircle2,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "../../../components/ui/utils";

const RULES_PER_PAGE = 10;

type RuleStatus = "published" | "draft" | "archived";

const statusConfig: Record<RuleStatus, { label: string; class: string; icon: any }> = {
  published: { label: "Diterbitkan", class: "bg-green-100 text-green-800 border-green-200", icon: Activity },
  draft: { label: "Draf", class: "bg-amber-100 text-amber-800 border-amber-200", icon: FileText },
  archived: { label: "Diarsipkan", class: "bg-slate-100 text-slate-600 border-slate-200", icon: Archive },
};

export default function ManajemenAturanPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RuleStatus | "Semua">("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/rules");
      if (!response.ok) throw new Error("Gagal ambil data");
      const data = await response.json();
      // Map API data to include UI status (default to published)
      const mapped = data.map((r: any) => ({
        ...r,
        status: "published" as RuleStatus // Default status because DB doesn't have it yet
      }));
      setRules(mapped);
    } catch (error) {
      console.error("Error fetching rules:", error);
      toast.error("Gagal mengambil data aturan dari server.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return rules.filter((r) => {
      const matchSearch = 
        r.penyakit.nama.toLowerCase().includes(search.toLowerCase()) || 
        r.gejala.nama.toLowerCase().includes(search.toLowerCase()) ||
        r.penyakit.kode.toLowerCase().includes(search.toLowerCase()) ||
        r.gejala.kode.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Semua" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rules, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / RULES_PER_PAGE);
  const paginatedRules = useMemo(() => {
    const start = (currentPage - 1) * RULES_PER_PAGE;
    return filtered.slice(start, start + RULES_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const deleteRule = async (id: number) => {
    try {
      const response = await fetch(`/api/rules?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setRules((prev) => prev.filter((r) => r.id !== id));
        toast.success("Aturan berhasil dihapus");
      } else {
        throw new Error("Gagal menghapus");
      }
    } catch (error) {
      toast.error("Gagal menghapus aturan");
    } finally {
      setDeleteId(null);
    }
  };

  const updateStatus = (id: number, status: RuleStatus) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Aturan ${statusConfig[status].label}`);
  };

  if (loading && rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <Loader2 className="h-12 w-12 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat data aturan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#006837] rounded-xl flex items-center justify-center shadow-md shadow-green-900/10">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Basis <span className="text-[#006837]">Aturan.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={fetchRules}
              disabled={loading}
              className="h-10 rounded-xl px-4 border-slate-200 text-slate-500 hover:text-[#006837] transition-all"
            >
              <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button asChild className="h-10 bg-[#006837] hover:bg-[#004d2c] text-white px-5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md shadow-green-900/10 transition-all">
              <Link href="/dashboard/admin/aturan/baru">
                <Plus className="h-3.5 w-3.5 mr-2" /> Aturan Baru
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section - Original Style */}
        <div className="grid grid-cols-3 gap-4">
          {(["published", "draft", "archived"] as const).map((s) => {
            const count = rules.filter((r) => r.status === s).length;
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            return (
              <div key={s} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-[#8DC63F] transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${cfg.class} border transition-all`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{cfg.label}</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Search - Original Style */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Cari aturan..." 
              className="pl-11 h-10 rounded-lg border-slate-50 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs text-slate-700" 
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {(["Semua", "Diterbitkan", "Draf", "Diarsipkan"] as const).map((label) => {
              const value = label === "Diterbitkan" ? "published" : 
                            label === "Draf" ? "draft" : 
                            label === "Diarsipkan" ? "archived" : "Semua";
              
              return (
                <button
                  key={label}
                  onClick={() => setStatusFilter(value as any)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all font-black uppercase tracking-widest text-[9px] border ${
                    statusFilter === value 
                      ? "bg-[#006837] text-white border-[#006837] shadow-md shadow-green-900/10" 
                      : "bg-white text-slate-400 border-slate-50 hover:border-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pl-6">Kode</TableHead>
                <TableHead className="w-[180px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Penyakit</TableHead>
                <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Gejala</TableHead>
                <TableHead className="w-[120px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">CF Pakar</TableHead>
                <TableHead className="w-[120px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Status</TableHead>
                <TableHead className="w-[150px] text-right font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <p className="font-black uppercase tracking-widest text-[10px] text-slate-300">Data Kosong</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRules.map((rule) => {
                  const status = statusConfig[rule.status as RuleStatus] || statusConfig.published;
                  return (
                    <TableRow key={rule.id} className="group hover:bg-slate-50/30 transition-all">
                      <TableCell className="py-4 pl-6">
                        <code className="text-[10px] font-black font-mono text-[#006837] bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                          {rule.penyakit.kode}
                        </code>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 text-sm leading-tight">
                            {rule.penyakit.nama}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-[350px]">
                          {rule.gejala.nama} ({rule.gejala.kode})
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-[350px]">
                          CF {rule.cfPakar.toFixed(2)} Bobot
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={`text-[8px] px-2 py-0.5 border font-black uppercase tracking-widest rounded-md ${status.class}`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            asChild 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Edit"
                          >
                            <Link href={`/dashboard/admin/aturan/${rule.id}`}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <div className="w-px h-4 bg-slate-100 mx-1" />

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 rounded-lg transition-all ${rule.status === "published" ? "text-[#006837] bg-green-50" : "text-slate-300 hover:text-[#006837] hover:bg-green-50"}`}
                            onClick={() => updateStatus(rule.id, "published")}
                            title="Terbitkan"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 rounded-lg transition-all ${rule.status === "draft" ? "text-amber-600 bg-amber-50" : "text-slate-300 hover:text-amber-600 hover:bg-amber-50"}`}
                            onClick={() => updateStatus(rule.id, "draft")}
                            title="Jadikan Draf"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 rounded-lg transition-all ${rule.status === "archived" ? "text-slate-600 bg-slate-100" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"}`}
                            onClick={() => updateStatus(rule.id, "archived")}
                            title="Arsipkan"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </Button>

                          <div className="w-px h-4 bg-slate-100 mx-1" />

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            onClick={() => setDeleteId(rule.id)}
                            title="Hapus"
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

        {/* Global Delete Alert Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-xl">Hapus Aturan?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Aturan ini akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl h-10 text-xs font-bold">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && deleteRule(deleteId)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 text-xs font-bold">Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total <span className="text-slate-900 font-black">{filtered.length}</span> Aturan
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
