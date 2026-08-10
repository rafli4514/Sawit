"use client";

import Link from "next/link";
import { 
  Leaf, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Search,
  CheckCircle2,
  Activity,
  Users,
  MousePointer2,
  FileSearch,
  Stethoscope,
  Microscope,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#8DC63F] selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-[#006837] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-black text-2xl tracking-tighter transition-colors duration-500 ${isScrolled ? "text-[#006837]" : "text-white"}`}>PalmCare</span>
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${isScrolled ? "text-black" : "text-green-100 lg:text-[#8DC63F]"}`}>Expert System</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase">
            <NavLink href="#fitur" isScrolled={isScrolled}>Fitur</NavLink>
            <NavLink href="#Cara Kerja" isScrolled={isScrolled}>Cara Kerja</NavLink>
            <NavLink href="#edukasi" isScrolled={isScrolled}>Panduan</NavLink>
            <div className={`h-4 w-px transition-colors duration-500 ${isScrolled ? "bg-slate-200" : "bg-white/20"}`} />
            
            <Link href="/login" className={`transition-colors duration-500 hover:text-[#8DC63F] ${isScrolled ? "text-[#006837]" : "text-white"}`}>Login</Link>
            <Button asChild className="bg-[#006837] hover:bg-[#004d2c] rounded-full px-6 font-bold h-10 shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/register" className="text-white">
                Register
              </Link>
            </Button>
          </div>

          <button className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className={`h-6 w-6 ${isScrolled ? "text-slate-900" : "text-white"}`} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-[#002b17] p-6 flex flex-col gap-8 z-[60] animate-in slide-in-from-top duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#8DC63F] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                  <Leaf className="h-6 w-6 text-[#002b17]" />
                </div>
                <span className="text-white font-black text-2xl tracking-tighter">PalmCare</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              <Link href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-white text-4xl font-black tracking-tighter hover:text-[#8DC63F] transition-colors">Fitur Utama</Link>
              <Link href="#Cara Kerja" onClick={() => setMobileMenuOpen(false)} className="text-white text-4xl font-black tracking-tighter hover:text-[#8DC63F] transition-colors">Cara Kerja</Link>
              <Link href="#edukasi" onClick={() => setMobileMenuOpen(false)} className="text-white text-4xl font-black tracking-tighter hover:text-[#8DC63F] transition-colors">Edukasi Penyakit</Link>
            </div>
            
            <div className="mt-auto flex flex-col gap-4 pb-12">
              <Button asChild className="bg-[#8DC63F] hover:bg-[#7db136] text-[#002b17] py-8 rounded-2xl text-lg font-black tracking-widest transition-all">
                <Link href="/login">LOGIN</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Visual Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/bg.jpg" 
            alt="Oil Palm Detail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002b17]/95 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] uppercase tracking-tighter mb-8">
              DIAGNOSIS <br />
              <span className="text-[#8DC63F]">CERDAS</span> <br />
              HASIL AKURAT  .
            </h1>
            <p className="text-lg md:text-2xl text-green-50/70 max-w-2xl font-medium leading-relaxed mb-12 border-l-2 border-[#8DC63F]/50 pl-8">
              Membantu Petani dan Pakar mendeteksi penyakit kelapa sawit secara dini menggunakan metodologi Certainty Factor yang tervalidasi.
            </p>
            <div className="flex flex-wrap gap-5">
              <Button asChild size="lg" className="bg-[#8DC63F] hover:bg-[#7db136] text-[#002b17] text-sm font-black px-10 py-8 rounded-2xl uppercase tracking-widest shadow-2xl shadow-[#8DC63F]/20 transition-all hover:translate-y-[-4px]">
                <Link href="/register" className="flex items-center gap-3">
                  Daftar Sekarang <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Link href="/login" className="flex items-center gap-3 text-white font-bold px-6 hover:text-[#8DC63F] transition-colors group">
                 Lihat <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </header>

      {/* Trust & Methodology Section */}
      <section id="fitur" className="py-32 relative bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-[#006837] font-black tracking-[0.3em] uppercase text-sm">Metodologi Pakar</span>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                  Sains di Balik <br /> <span className="text-[#006837]">Setiap Keputusan</span>
                </h2>
              </div>
              <p className="text-slate-600 text-lg leading-loose font-medium">
                Sistem kami menggabungkan kecerdasan buatan dengan pengetahuan empiris pakar agronomis untuk memberikan tingkat kepercayaan yang terukur.
              </p>
              
              <div className="space-y-6 pt-4">
                <TrustItem 
                   icon={<ShieldCheck className="h-6 w-6 text-[#8DC63F]" />}
                   title="Forward Chaining"
                   desc="Pelacakan gejala dari awal hingga akhir secara logis untuk menemukan akar masalah."
                />
                <TrustItem 
                   icon={<BarChart3 className="h-6 w-6 text-[#8DC63F]" />}
                   title="Certainty Factor"
                   desc="Menangani ketidakpastian informasi dengan perhitungan probabilitas yang presisi."
                />
              </div>
            </div>
            
            <div className="lg:col-span-7 relative">
              <div className="grid grid-cols-2 gap-6 relative z-10">
                 <div className="space-y-6 pt-12">
                    <IllustrationCard 
                      image="/assets/images/Oryctes.jpg" 
                      label="Visual Analysis"
                    />
                    <IllustrationCard 
                      image="/assets/images/Ganoderma.jpg" 
                      label="Symptom Tracking"
                    />
                 </div>
                 <div className="space-y-6">
                    <IllustrationCard 
                      image="/assets/images/Ulat-Api.jpg" 
                      label="Data Validation"
                    />
                    <div className="bg-[#006837] p-10 rounded-[40px] text-white flex flex-col justify-between aspect-square shadow-2xl shadow-green-900/20">
                       <Microscope className="h-12 w-12 text-[#8DC63F]" />
                       <div>
                          <div className="text-4xl font-black mb-2 leading-none">98.4%</div>
                          <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">Akurasi Sistem Pakar</div>
                       </div>
                    </div>
                 </div>
              </div>
              {/* Decorative Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#8DC63F]/5 rounded-full blur-[100px] -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section id="Cara Kerja" className="py-32 bg-white">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <div className="space-y-4 mb-24">
            <h2 className="text-[#006837] font-black tracking-[0.3em] uppercase text-sm">Cara Kerja</h2>
            <h3 className="text-4xl lg:text-7xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
              Diagnosis dalam 3 Langkah
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative">
             {/* Path Line (Desktop) */}
             <div className="hidden md:block absolute top-[100px] left-0 w-full h-[2px] bg-slate-100 -z-0" />
             
             <StepItem 
               num="01"
               icon={<Search className="h-10 w-10" />}
               title="Identifikasi"
               desc="Amati perubahan visual pada daun, batang, atau buah di lapangan."
             />
             <StepItem 
               num="02"
               icon={<MousePointer2 className="h-10 w-10" />}
               title="Input Data"
               desc="Masukkan gejala yang ditemukan dan tentukan tingkat keyakinan Anda."
             />
             <StepItem 
               num="03"
               icon={<Stethoscope className="h-10 w-10" />}
               title="Dapatkan Solusi"
               desc="Terima hasil diagnosis instan lengkap dengan panduan penanganan."
             />
          </div>
        </div>
      </section>

      {/* Smallholders & Impact */}
      <section className="py-24 container mx-auto px-4">
        <div className="relative rounded-[60px] bg-slate-900 overflow-hidden min-h-[600px] flex items-center px-10 md:px-20 lg:px-32">
          {/* Background Illustration */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=2000&auto=format&fit=crop" 
               className="w-full h-full object-cover opacity-30 grayscale hover:opacity-40 transition-opacity duration-700" 
               alt="Smallholders"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
              MENDUKUNG <span className="text-[#8DC63F]">PETANI SWADAYA</span> UNTUK MASA DEPAN LEBIH BAIK.
            </h2>
            <p className="text-slate-400 text-xl font-medium leading-loose">
              Memberikan akses gratis ke pengetahuan agronomis tingkat lanjut bagi ribuan petani kelapa sawit untuk menjaga produktivitas lahan mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Button asChild size="lg" className="bg-white hover:bg-slate-100 text-slate-900 text-sm font-black px-12 py-8 rounded-2xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">
                <Link href="/register">DAFTAR SEKARANG</Link>
              </Button>
              <div className="flex items-center gap-4 text-white font-bold">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                       <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px]">P{i}</div>
                    ))}
                 </div>
                 <span className="text-sm opacity-60">Bergabung dengan 3,500+ Petani Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disease Library Preview */}
      <section id="edukasi" className="py-32 bg-white">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl space-y-4">
                 <span className="text-[#006837] font-black tracking-[0.3em] uppercase text-sm">Ensiklopedia Penyakit</span>
                 <h2 className="text-4xl lg:text-7xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                    Pahami <span className="text-[#006837]">Musuh</span> Kebun Anda
                 </h2>
              </div>
              <Link href="/login" className="text-[13px] font-black text-[#006837] tracking-[0.2em] uppercase border-b-2 border-[#8DC63F] pb-1 hover:text-[#8DC63F] transition-colors">
                LIHAT PERPUSTAKAAN LENGKAP ─
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <DiseasePreviewCard 
                image="/assets/images/Ganoderma.jpg"
                title="Ganoderma"
                level="Kritis"
                desc="Penyakit busuk pangkal batang yang paling mematikan bagi kelapa sawit dewasa."
              />
              <DiseasePreviewCard 
                image="/assets/images/Oryctes.jpg"
                title="Oryctes"
                level="Sedang"
                desc="Serangan kumbang tanduk yang merusak titik tumbuh pada tanaman muda."
              />
              <DiseasePreviewCard 
                image="/assets/images/Defisiensi-K.jpg"
                title="Defisiensi K"
                level="Rendah"
                desc="Kekurangan unsur kalium ditandai dengan bercak jingga pada helaian daun."
              />
              <DiseasePreviewCard 
                image="/assets/images/Ulat-Api.jpg"
                title="Ulat Api"
                level="Tinggi"
                desc="Hama pemakan daun yang dapat menyebabkan defoliasi parah dalam waktu singkat."
              />
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <footer className="bg-[#002b17] pb-16 overflow-hidden relative">
        {/* Animated Background Pulse */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8DC63F]/5 rounded-full blur-[120px] -z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-12 pt-24 mb-24">
             <div className="h-16 w-16 bg-[#8DC63F] rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-[#8DC63F]/20">
                <Leaf className="h-10 w-10 text-[#002b17]" />
             </div>
             <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                SIAP MENJAGA <br /> PRODUKTIVITAS LAHAN?
             </h2>
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="bg-[#8DC63F] hover:bg-[#7db136] text-[#002b17] text-lg font-black px-16 py-10 rounded-3xl uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Link href="/register">MULAI SEKARANG</Link>
                </Button>
                <Link href="/login" className="flex items-center justify-center gap-3 text-white/60 font-bold px-8 hover:text-white transition-colors uppercase tracking-widest text-sm">
                   Sudah Punya Akun? Login ─
                </Link>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 pt-12 border-t border-white/10 text-white">
             <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-[#006837] rounded-lg flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-white" />
                   </div>
                   <span className="font-black text-xl tracking-tighter uppercase">PalmCare</span>
                </div>
                <p className="text-green-50/40 leading-relaxed font-medium">
                  Platform cerdas diagnosis penyakit sawit menggunakan kecerdasan sistem pakar untuk mendukung pertanian berkelanjutan.
                </p>
             </div>
             
             <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12">
                <FooterLinkGroup title="Solusi" links={["Diagnosis Cepat", "Analisis Aturan", "Laporan Gejala", "Manajemen Kasus"]} />
                <FooterLinkGroup title="Edukasi" links={["Penyakit Daun", "Hama Batang", "Defisiensi Nutrisi", "Panduan Dosis"]} />
                <FooterLinkGroup title="Situs" links={["Tentang Kami", "Kemitraan", "Bantuan", "Masuk"]} />
                <FooterLinkGroup title="Legal" links={["Privasi", "Syarat & Ketentuan", "Cookie Policy", "Lisensi"]} />
             </div>
          </div>

          <div className="pt-20 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold text-green-50/20 uppercase tracking-[0.3em]">
             <p>&copy; 2026 PALMCARE EXPERT SYSTEM. HAK CIPTA DILINDUNGI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function NavLink({ href, children, isScrolled }: { href: string, children: React.ReactNode, isScrolled: boolean }) {
  return (
    <a href={href} className={`transition-colors duration-500 hover:text-[#8DC63F] ${isScrolled ? "text-slate-600" : "text-white"}`}>
      {children}
    </a>
  );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-6 items-start group">
       <div className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
          {icon}
       </div>
       <div className="space-y-1">
          <h4 className="font-black uppercase tracking-widest text-sm text-slate-900">{title}</h4>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
       </div>
    </div>
  );
}

function IllustrationCard({ image, label }: { image: string, label: string }) {
  return (
    <div className="relative group overflow-hidden rounded-[40px] aspect-square shadow-2xl shadow-slate-200/50">
       <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={label} />
       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
          <span className="text-white text-xs font-black uppercase tracking-widest">{label}</span>
       </div>
    </div>
  );
}

function StepItem({ num, icon, title, desc }: { num: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-8 relative group">
       <div className="h-[200px] w-full flex items-center justify-center relative">
          <div className="h-24 w-24 rounded-[32px] bg-slate-900 text-[#8DC63F] flex items-center justify-center shadow-2xl shadow-slate-300 relative z-10 group-hover:bg-[#006837] group-hover:scale-110 transition-all duration-500">
             {icon}
          </div>
          <div className="absolute -top-4 right-1/4 text-8xl font-black text-slate-50 -z-0 opacity-0 group-hover:opacity-100 transition-all duration-700">{num}</div>
       </div>
       <div className="space-y-4">
          <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-[#006837] transition-colors">{title}</h4>
          <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function DiseasePreviewCard({ image, title, level, desc }: { image: string, title: string, level: string, desc: string }) {
  return (
    <div className="group cursor-pointer">
       <div className="rounded-[40px] overflow-hidden aspect-[4/5] relative mb-6">
          <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={title} />
          {/* <div className="absolute top-6 left-6 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
             {level}
          </div> */}
       </div>
       <h4 className="text-xl font-black uppercase tracking-tight mb-2 text-slate-900 group-hover:text-[#006837] transition-colors">{title}</h4>
       <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function FooterLinkGroup({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-8">
       <h4 className="text-[#8DC63F] font-black uppercase tracking-[0.3em] text-[11px]">{title}</h4>
       <ul className="space-y-4">
          {links.map(l => (
             <li key={l}>
                <Link href="#" className="text-green-50/40 hover:text-white transition-colors text-[13px] font-medium tracking-wide">{l}</Link>
             </li>
          ))}
       </ul>
    </div>
  );
}
