"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogOut, Save, ShieldCheck, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, login } = useAuth();
  const [name, setName] = useState(user?.nama || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logout();
      router.push("/");
      toast.success("Berhasil keluar");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          nama: name,
          email: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local context
        login({ ...user, nama: data.user.nama, email: data.user.email });
        toast.success("Profil berhasil diperbarui");
      } else {
        throw new Error(data.message || "Gagal memperbarui profil");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Semua field password harus diisi");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Password baru tidak cocok");
      return;
    }

    setPassLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password berhasil diperbarui");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        throw new Error(data.message || "Gagal memperbarui password");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 min-h-screen">
      {/* Page Heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Pengaturan Akun</h1>
        <p className="text-slate-500 font-medium mt-2">Kelola informasi profil dan keamanan akses Anda di satu tempat.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-10">
        
        {/* Sidebar Summary */}
        <aside className="w-full xl:w-[400px] flex-shrink-0">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm text-center space-y-8 sticky top-24">
            <div className="relative inline-block">
              <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-[#006837] to-[#8DC63F] flex items-center justify-center text-white shadow-2xl shadow-green-900/20 rotate-3">
                <span className="text-4xl font-black uppercase -rotate-3">{name.charAt(0)}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-xl border border-slate-50">
                <BadgeCheck className="h-7 w-7 text-blue-500 fill-blue-50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{name || "User"}</h2>
              <div className="inline-flex px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                <p className="text-[#006837] text-[10px] font-black uppercase tracking-widest">{user?.role || "Petani"}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ID Unik</span>
                <span className="text-xs font-bold text-slate-700 font-mono">NYW-{user?.id?.toString().padStart(4, '0') || '0001'}</span>
              </div>
            </div>

            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full h-14 border-red-100 text-red-500 hover:bg-red-50 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all mt-4 border-2"
            >
              <LogOut className="h-4 w-4 mr-3" /> Keluar Akun
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-10">
          
          {/* Information Card */}
          <section className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm space-y-12">
            <div className="flex items-start gap-6">
              <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <User className="h-7 w-7 text-[#006837]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Detail Profil</h3>
                <p className="text-slate-500 font-medium">Informasi ini digunakan untuk identitas Anda di seluruh aplikasi.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 md:col-span-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Nama Lengkap</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-16 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all font-bold text-slate-800 text-lg px-6"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Alamat Email Aktif</Label>
                <Input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="h-16 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all font-bold text-slate-800 text-lg px-6"
                />
              </div>
              <div className="md:col-span-2 pt-6">
                <Button 
                  disabled={loading}
                  className="w-full md:w-auto h-16 px-12 bg-[#006837] hover:bg-[#004d2c] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-green-900/20 active:scale-[0.95]"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
                  {loading ? "Memperbarui..." : "Simpan Pembaruan"}
                </Button>
              </div>
            </form>
          </section>

          {/* Security Card */}
          <section className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm space-y-12">
            <div className="flex items-start gap-6">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Lock className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Privasi & Keamanan</h3>
                <p className="text-slate-500 font-medium">Jaga kerahasiaan akses Anda dengan memperbarui password secara berkala.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Konfirmasi Password Lama</Label>
                <Input 
                  type="password"
                  placeholder="Masukkan password saat ini"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="h-16 rounded-2xl bg-slate-50 border-slate-100 font-bold px-6"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Buat Password Baru</Label>
                  <Input 
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="h-16 rounded-2xl bg-slate-50 border-slate-100 font-bold px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Ulangi Password Baru</Label>
                  <Input 
                    type="password"
                    placeholder="Sama dengan di samping"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="h-16 rounded-2xl bg-slate-50 border-slate-100 font-bold px-6"
                  />
                </div>
              </div>
              <div className="pt-6">
                <Button 
                  disabled={passLoading}
                  variant="outline" 
                  className="w-full h-16 border-2 border-[#8DC63F] text-[#006837] hover:bg-green-50 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.95]"
                >
                  {passLoading && <Loader2 className="h-5 w-5 animate-spin mr-3" />}
                  {passLoading ? "Memperbarui..." : "Konfirmasi Ganti Password"}
                </Button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}
