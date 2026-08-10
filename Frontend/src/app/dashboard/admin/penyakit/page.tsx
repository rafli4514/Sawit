"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight,
  Loader2, RefreshCcw, FlaskConical, X, Save, AlertCircle
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "../../../components/ui/utils";

const ITEMS_PER_PAGE = 10;

type Penyakit = {
  id: number;
  kode: string;
  nama: string;
  deskripsi?: string;
  solusi?: string;
};

const emptyForm: Omit<Penyakit, "id"> = { kode: "", nama: "", deskripsi: "", solusi: "" };

export default function ManajemenPenyakitPage() {
  const [penyakitList, setPenyakitList] = useState<Penyakit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchPenyakit(); }, []);

  const fetchPenyakit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/penyakit");
      if (!res.ok) throw new Error("Gagal ambil data");
      const data = await res.json();
      setPenyakitList(data);
    } catch {
      toast.error("Gagal mengambil data penyakit.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() =>
    penyakitList.filter(p =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.kode.toLowerCase().includes(search.toLowerCase()) ||
      (p.deskripsi || "").toLowerCase().includes(search.toLowerCase())
    ), [penyakitList, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Penyakit) => {
    setEditId(p.id);
    setForm({ kode: p.kode, nama: p.nama, deskripsi: p.deskripsi || "", solusi: p.solusi || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kode.trim() || !form.nama.trim()) {
      toast.error("Kode dan Nama wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/penyakit/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal update");
        const updated = await res.json();
        setPenyakitList(prev => prev.map(p => p.id === editId ? updated : p));
        toast.success("Penyakit berhasil diperbarui");
      } else {
        const res = await fetch("/api/penyakit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal tambah");
        const created = await res.json();
        setPenyakitList(prev => [...prev, created]);
        toast.success("Penyakit berhasil ditambahkan");
      }
      setShowForm(false);
    } catch {
      toast.error(editId ? "Gagal memperbarui penyakit." : "Gagal menambah penyakit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/penyakit/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      setPenyakitList(prev => prev.filter(p => p.id !== deleteId));
      toast.success("Penyakit berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus penyakit. Pastikan tidak ada aturan atau riwayat terkait.");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading && penyakitList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <Loader2 className="h-12 w-12 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat data penyakit...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#006837] rounded-xl flex items-center justify-center shadow-md shadow-green-900/10">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Basis <span className="text-[#006837]">Penyakit.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchPenyakit}
              disabled={loading}
              className="h-10 rounded-xl px-4 border-slate-200 text-slate-500 hover:text-[#006837]"
            >
              <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              onClick={openCreate}
              className="h-10 bg-[#006837] hover:bg-[#004d2c] text-white px-5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md shadow-green-900/10"
            >
              <Plus className="h-3.5 w-3.5 mr-2" /> Penyakit Baru
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-red-50 border border-red-100">
              <FlaskConical className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Penyakit</p>
              <p className="text-xl font-black text-slate-900 leading-none">{penyakitList.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari penyakit berdasarkan nama atau kode..."
              className="pl-11 h-10 rounded-lg border-slate-50 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs text-slate-700"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pl-6">Kode</TableHead>
                <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Nama Penyakit</TableHead>
                <TableHead className="w-[300px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Deskripsi</TableHead>
                <TableHead className="w-[100px] text-right font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-16 text-center">
                    <p className="font-black uppercase tracking-widest text-[10px] text-slate-300">Data Kosong</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((p) => (
                  <TableRow key={p.id} className="group hover:bg-slate-50/30 transition-all">
                    <TableCell className="py-4 pl-6">
                      <code className="text-[10px] font-black font-mono text-[#006837] bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                        {p.kode}
                      </code>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-bold text-slate-900 text-sm">{p.nama}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {p.deskripsi || <span className="italic text-slate-300">Tidak ada deskripsi</span>}
                      </p>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => openEdit(p)}
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="w-px h-4 bg-slate-100 mx-1" />
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50"
                          onClick={() => setDeleteId(p.id)}
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total <span className="text-slate-900 font-black">{filtered.length}</span> Penyakit
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100 text-slate-400 hover:text-[#006837] disabled:opacity-20"
                disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[10px] font-black text-slate-900 w-8 text-center">{currentPage}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100 text-slate-400 hover:text-[#006837] disabled:opacity-20"
                disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-xl">Hapus Penyakit?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Penyakit ini dan semua aturan terkait akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl h-10 text-xs font-bold">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 text-xs font-bold">Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create/Edit Slide-over Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
              {/* Form Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{editId ? "Edit Penyakit" : "Tambah Penyakit Baru"}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{editId ? "Perbarui informasi penyakit" : "Isi form di bawah untuk menambah penyakit"}</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Kode Penyakit *</label>
                  <Input
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: P01"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Gunakan format P01, P02, dst. Harus unik.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Nama Penyakit *</label>
                  <Input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Ganoderma"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Deskripsi</label>
                  <textarea
                    value={form.deskripsi}
                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                    placeholder="Deskripsi penyakit, gejala umum, penyebab, dll..."
                    rows={4}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Panduan Penanganan / Solusi</label>
                  <textarea
                    value={form.solusi}
                    onChange={(e) => setForm({ ...form, solusi: e.target.value })}
                    placeholder="Langkah-langkah penanganan, rekomendasi pengobatan, tindakan pencegahan..."
                    rows={5}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-12 bg-[#006837] hover:bg-[#004d2c] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-900/10"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {submitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
