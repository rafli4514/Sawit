"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Leaf, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon,
  Eye, 
  EyeOff, 
  ChevronRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      toast.error("Gagal Daftar", { description: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nama: name, 
          email: email.toLowerCase().trim(), 
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      toast.success("Registrasi Berhasil", {
        description: "Akun Anda telah dibuat. Silakan masuk untuk memulai.",
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      const msg = err.message || "Terjadi kesalahan saat mendaftar.";
      setError(msg);
      toast.error("Registrasi Gagal", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Left Section: Aesthetic Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002b17] relative p-16 flex-col justify-between overflow-hidden">
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8DC63F]/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8DC63F]/5 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3 group">
          <div className="h-12 w-12 bg-[#8DC63F] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#8DC63F]/20 transition-transform group-hover:scale-110">
            <Leaf className="h-7 w-7 text-[#002b17]" />
          </div>
          <span className="text-white font-black text-3xl tracking-tighter uppercase">PalmCare</span>
        </Link>

          <h2 className="text-6xl xl:text-8xl font-black text-white leading-[0.9] uppercase tracking-tighter">
            AKSES <br />
            DIAGNOSIS <br />
            <span className="text-[#8DC63F]">CERDAS</span>
          </h2>
          <p className="text-green-50/60 text-xl font-medium leading-relaxed border-l-4 border-[#8DC63F] pl-8">
            Platform manajemen kesehatan kelapa sawit berbasis sains untuk hasil yang optimal dan berkelanjutan.
          </p>
        </div>

      {/* Right Section: Register Form */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 relative bg-white overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto space-y-6 py-8">
          
          <div className="lg:hidden flex justify-center mb-4">
            <div className="h-12 w-12 bg-[#002b17] rounded-2xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-[#8DC63F]" />
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#006837] transition-colors mb-2 group">
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Kembali
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Daftar <span className="text-[#006837]">Akun</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nama Lengkap</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
                  <Input 
                    id="name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Nama Lengkap Anda" 
                    required 
                    className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#8DC63F] focus:border-[#8DC63F] text-sm font-medium transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Alamat Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="email@domain.com" 
                    required 
                    className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#8DC63F] focus:border-[#8DC63F] text-sm font-medium transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Kata Sandi</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                      className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#8DC63F] focus:border-[#8DC63F] text-sm font-medium transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Konfirmasi</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
                    <Input 
                      id="confirm" 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                      className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#8DC63F] focus:border-[#8DC63F] text-sm font-medium transition-all" 
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#006837] flex items-center gap-1.5 self-start transition-colors"
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPassword ? "Sembunyikan" : "Tampilkan"} Kata Sandi
              </button>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl border-red-100 bg-red-50 text-red-900 py-2.5">
                <AlertDescription className="text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5" /> {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#006837] hover:bg-[#004d2c] text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 group mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Daftar Sekarang <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-slate-50">
            <p className="text-xs text-slate-500 font-medium">
              Sudah memiliki akun? {" "}
              <Link href="/login" className="text-[#006837] font-black uppercase tracking-widest text-[10px] hover:text-[#8DC63F] transition-colors ml-1 underline underline-offset-4 decoration-2">
                Masuk Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
