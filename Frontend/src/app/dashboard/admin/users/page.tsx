"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search, Trash2, ChevronLeft, ChevronRight,
  Loader2, RefreshCcw, Users, ShieldCheck, User, Calendar
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
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
import { useAuth } from "../../../context/AuthContext";

const ITEMS_PER_PAGE = 10;

type UserData = {
  id: number;
  nama: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  _count: { riwayat: number };
};

export default function ManajemenUserPage() {
  const { user: currentUser } = useAuth();
  const [userList, setUserList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"Semua" | "ADMIN" | "USER">("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Gagal ambil data");
      const data = await res.json();
      setUserList(data);
    } catch {
      toast.error("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() =>
    userList.filter(u => {
      const matchSearch =
        u.nama.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "Semua" || u.role === roleFilter;
      return matchSearch && matchRole;
    }), [userList, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search, roleFilter]);

  const handleToggleRole = async (user: UserData) => {
    if (Number(user.id) === Number(currentUser?.id)) {
      toast.error("Tidak bisa mengubah role akun sendiri.");
      return;
    }
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      if (!res.ok) throw new Error("Gagal update role");
      setUserList(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      toast.success(`Role ${user.nama} diubah ke ${newRole === "ADMIN" ? "Administrator" : "Petani"}`);
    } catch {
      toast.error("Gagal mengubah role user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (Number(deleteId) === Number(currentUser?.id)) {
      toast.error("Tidak bisa menghapus akun sendiri.");
      setDeleteId(null);
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deleteId }),
      });
      if (!res.ok) throw new Error("Gagal hapus");
      setUserList(prev => prev.filter(u => u.id !== deleteId));
      toast.success("User berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus user.");
    } finally {
      setDeleteId(null);
    }
  };

  const adminCount = userList.filter(u => u.role === "ADMIN").length;
  const userCount = userList.filter(u => u.role === "USER").length;

  if (loading && userList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <Loader2 className="h-12 w-12 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat data user...</p>
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
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Manajemen <span className="text-[#006837]">User.</span>
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
            className="h-10 rounded-xl px-4 border-slate-200 text-slate-500 hover:text-[#006837]"
          >
            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total User", value: userList.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "Administrator", value: adminCount, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
            { label: "Petani", value: userCount, icon: User, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-[#8DC63F] transition-all">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user berdasarkan nama atau email..."
              className="pl-11 h-10 rounded-lg border-slate-50 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs text-slate-700"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["Semua", "ADMIN", "USER"] as const).map((label) => (
              <button
                key={label}
                onClick={() => setRoleFilter(label)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all font-black uppercase tracking-widest text-[9px] border ${
                  roleFilter === label
                    ? "bg-[#006837] text-white border-[#006837] shadow-md shadow-green-900/10"
                    : "bg-white text-slate-400 border-slate-50 hover:border-slate-200"
                }`}
              >
                {label === "USER" ? "Petani" : label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pl-6">Nama</TableHead>
                <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Email</TableHead>
                <TableHead className="w-[120px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Role</TableHead>
                <TableHead className="w-[120px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Diagnosis</TableHead>
                <TableHead className="w-[140px] font-black text-slate-900 uppercase tracking-wider text-[9px] py-4">Bergabung</TableHead>
                <TableHead className="w-[120px] text-right font-black text-slate-900 uppercase tracking-wider text-[9px] py-4 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <p className="font-black uppercase tracking-widest text-[10px] text-slate-300">Data Kosong</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((u) => (
                  <TableRow key={u.id} className="group hover:bg-slate-50/30 transition-all">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#006837] to-[#8DC63F] flex items-center justify-center shrink-0">
                          <span className="text-xs font-black text-white uppercase">{u.nama.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm leading-tight">{u.nama}</span>
                          {u.id === Number(currentUser?.id) && (
                            <span className="block text-[9px] font-black text-[#006837] uppercase tracking-widest">Anda</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[8px] px-2 py-0.5 border font-black uppercase tracking-widest rounded-md",
                          u.role === "ADMIN"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-green-50 text-green-800 border-green-200"
                        )}
                      >
                        {u.role === "ADMIN" ? "Admin" : "Petani"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-bold text-slate-700">{u._count.riwayat}</span>
                      <span className="text-[10px] text-slate-400 ml-1">kasus</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingId === u.id || u.id === Number(currentUser?.id)}
                          onClick={() => handleToggleRole(u)}
                          className={cn(
                            "h-8 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all px-3",
                            u.role === "ADMIN"
                              ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                              : "text-[#006837] bg-green-50 hover:bg-green-100",
                            u.id === Number(currentUser?.id) && "opacity-30 cursor-not-allowed"
                          )}
                          title={u.role === "ADMIN" ? "Jadikan Petani" : "Jadikan Admin"}
                        >
                          {updatingId === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            u.role === "ADMIN" ? "→ Petani" : "→ Admin"
                          )}
                        </Button>
                        <div className="w-px h-4 bg-slate-100 mx-1" />
                        <Button
                          variant="ghost" size="icon"
                          className={cn(
                            "h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all",
                            u.id === Number(currentUser?.id) && "opacity-30 cursor-not-allowed"
                          )}
                          onClick={() => u.id !== Number(currentUser?.id) && setDeleteId(u.id)}
                          title="Hapus User"
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
              Total <span className="text-slate-900 font-black">{filtered.length}</span> User
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
              <AlertDialogTitle className="font-black text-xl">Hapus User?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                User ini dan semua riwayat diagnosisnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl h-10 text-xs font-bold">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 text-xs font-bold">Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}
