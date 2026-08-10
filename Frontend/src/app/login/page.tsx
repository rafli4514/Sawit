"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Leaf, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      login(data.user);
      toast.success("Login Berhasil", {
        description: "Selamat datang kembali di PalmCare Expert System.",
      });
      router.replace(from);
    } catch (err: any) {
      setError(err.message || "Kredensial tidak valid. Silakan periksa kembali email dan kata sandi Anda.");
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

      {/* Right Section: Login Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 md:p-20 relative bg-white">
        <div className="max-w-md w-full mx-auto space-y-6 py-4">
          
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
              Masuk <span className="text-[#006837]">Akun</span>
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">Alamat Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="nama@gmail.com" 
                    required 
                    className="h-16 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#8DC63F] focus:border-[#8DC63F] text-lg font-medium transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-500">Kata Sandi</Label>
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#006837] transition-colors">Lupa Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#006837] transition-colors" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="h-16 pl-12 pr-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-[#8DC63F] focus:border-[#8DC63F] text-lg font-medium transition-all" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50 text-red-900 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertDescription className="text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-[#006837] hover:bg-[#004d2c] text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  Masuk Sekarang <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="pt-8 text-center border-t border-slate-100">
            <p className="text-slate-500 font-medium">
              Belum memiliki akun? {" "}
              <Link href="/register" className="text-[#006837] font-black uppercase tracking-widest text-xs hover:text-[#8DC63F] transition-colors ml-2 underline underline-offset-4 decoration-2">
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-12 w-12 border-4 border-[#006837]/20 border-t-[#006837] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


