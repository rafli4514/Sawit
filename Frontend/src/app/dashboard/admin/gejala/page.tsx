"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight,
  Loader2, RefreshCcw, Microscope, X, Save, ImagePlus, ImageOff
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

type Gejala = {
  id: number;
  kode: string;
  nama: string;
  imageUrl?: string | null;
};

const emptyForm: Omit<Gejala, "id"> = { kode: "", nama: "", imageUrl: null };

export default function ManajemenGejalaPage() {
  const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchGejala(); }, []);

  const fetchGejala = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gejala");
      if (!res.ok) throw new Error("Gagal ambil data");
      const data = await res.json();
      setGejalaList(data);
    } catch {
      toast.error("Gagal mengambil data gejala.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() =>
    gejalaList.filter(g =>
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      g.kode.toLowerCase().includes(search.toLowerCase())
    ), [gejalaList, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (g: Gejala) => {
    setEditId(g.id);
    setForm({ kode: g.kode, nama: g.nama, imageUrl: g.imageUrl || null });
    setImagePreview(g.imageUrl || null);
    setShowForm(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi sisi klien
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB.");
      return;
    }

    // Tampilkan preview lokal dulu
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload ke server
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload gagal");
      const { url } = await res.json();
      setForm(prev => ({ ...prev, imageUrl: url }));
      toast.success("Foto berhasil diunggah");
    } catch {
      toast.error("Gagal mengunggah foto ke server.");
      setImagePreview(form.imageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setForm(prev => ({ ...prev, imageUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kode.trim() || !form.nama.trim()) {
      toast.error("Kode dan Nama wajib diisi.");
      return;
    }
    if (uploading) {
      toast.error("Tunggu hingga foto selesai diunggah.");
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/gejala/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal update");
        const updated = await res.json();
        setGejalaList(prev => prev.map(g => g.id === editId ? updated : g));
        toast.success("Gejala berhasil diperbarui");
      } else {
        const res = await fetch("/api/gejala", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal tambah");
        const created = await res.json();
        setGejalaList(prev => [...prev, created]);
        toast.success("Gejala berhasil ditambahkan");
      }
      setShowForm(false);
    } catch {
      toast.error(editId ? "Gagal memperbarui gejala." : "Gagal menambah gejala.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/gejala/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      setGejalaList(prev => prev.filter(g => g.id !== deleteId));
      toast.success("Gejala berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus gejala.");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading && gejalaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <Loader2 className="h-12 w-12 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat data gejala...</p>
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
              <Microscope className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Basis <span className="text-[#006837]">Gejala.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchGejala} disabled={loading}
              className="h-10 rounded-xl px-4 border-slate-200 text-slate-500 hover:text-[#006837]">
              <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={openCreate}
              className="h-10 bg-[#006837] hover:bg-[#004d2c] text-white px-5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md shadow-green-900/10">
              <Plus className="h-3.5 w-3.5 mr-2" /> Gejala Baru
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 w-fit">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
            <Microscope className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Gejala</p>
            <p className="text-xl font-black text-slate-900 leading-none">{gejalaList.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari gejala berdasarkan nama atau kode..."
              className="pl-11 h-10 rounded-lg border-slate-50 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs text-slate-700" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pl-6">Foto</TableHead>
                <TableHead className="w-[100px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Kode</TableHead>
                <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Nama Gejala</TableHead>
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
                paginated.map((g) => (
                  <TableRow key={g.id} className="group hover:bg-slate-50/30 transition-all">
                    {/* Thumbnail */}
                    <TableCell className="py-3 pl-6">
                      {g.imageUrl ? (
                        <img
                          src={g.imageUrl}
                          alt={g.nama}
                          className="h-12 w-16 object-cover rounded-xl border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center">
                          <ImageOff className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <code className="text-[10px] font-black font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        {g.kode}
                      </code>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-bold text-slate-900 text-sm">{g.nama}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => openEdit(g)} title="Edit">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="w-px h-4 bg-slate-100 mx-1" />
                        <Button variant="ghost" size="icon"
                          className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50"
                          onClick={() => setDeleteId(g.id)} title="Hapus">
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
              Total <span className="text-slate-900 font-black">{filtered.length}</span> Gejala
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
              <AlertDialogTitle className="font-black text-xl">Hapus Gejala?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Gejala ini dan semua aturan yang menggunakan gejala ini akan dihapus permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl h-10 text-xs font-bold">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 text-xs font-bold">Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Slide-over Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => !uploading && setShowForm(false)} />
            <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
              {/* Form Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{editId ? "Edit Gejala" : "Tambah Gejala Baru"}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{editId ? "Perbarui informasi dan foto gejala" : "Isi form dan upload foto referensi gejala"}</p>
                </div>
                <button onClick={() => setShowForm(false)} disabled={uploading}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">

                {/* Upload Foto */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Foto Referensi Gejala</label>

                  {imagePreview ? (
                    /* Preview mode */
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      {/* Overlay loading saat upload */}
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-8 w-8 text-[#006837] animate-spin" />
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Mengunggah...</p>
                        </div>
                      )}
                      {/* Tombol hapus foto */}
                      {!uploading && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
                          title="Hapus foto"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Upload area */
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#006837] transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <ImagePlus className="h-6 w-6 text-slate-400 group-hover:text-[#006837]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-500 group-hover:text-[#006837]">Klik untuk pilih foto</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP · Maks 5MB</p>
                      </div>
                    </button>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Kode */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Kode Gejala *</label>
                  <Input
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value.toUpperCase() })}
                    placeholder="Contoh: G01"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Gunakan format G01, G02, dst. Harus unik.</p>
                </div>

                {/* Nama */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Nama Gejala *</label>
                  <Input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Daun menguning pada ujung"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 flex gap-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={uploading}
                    className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest">
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting || uploading}
                    className="flex-1 h-12 bg-[#006837] hover:bg-[#004d2c] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-900/10">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {submitting ? "Menyimpan..." : uploading ? "Menunggu upload..." : "Simpan"}
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
