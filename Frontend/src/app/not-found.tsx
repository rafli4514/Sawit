"use client";

import Link from "next/link";
import { Leaf, ArrowLeft, Home } from "lucide-react";
import { Button } from "./components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#002b17] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8DC63F]/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#006837]/10 rounded-full blur-[100px] -z-0" />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="h-12 w-12 bg-[#006837] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/30">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <span className="font-black text-3xl tracking-tighter text-white">PalmCare</span>
        </div>

        {/* 404 Number */}
        <div className="relative mb-8">
          <p className="text-[180px] md:text-[260px] font-black text-white/5 leading-none select-none absolute -top-10 left-1/2 -translate-x-1/2 w-full">
            404
          </p>
          <p className="relative text-[#8DC63F] font-black tracking-[0.3em] uppercase text-sm mb-6">
            Halaman Tidak Ditemukan
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
            LAHAN INI<br />
            <span className="text-[#8DC63F]">KOSONG.</span>
          </h1>
        </div>

        <p className="text-green-50/50 text-lg font-medium leading-relaxed mb-12 max-w-md mx-auto">
          Halaman yang kamu cari tidak ada atau telah dipindahkan. Kembali ke halaman utama untuk melanjutkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#8DC63F] hover:bg-[#7db136] text-[#002b17] font-black px-10 py-7 rounded-2xl uppercase tracking-widest shadow-2xl shadow-[#8DC63F]/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/" className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              Halaman Utama
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/10 text-white hover:bg-white/5 hover:text-white font-bold px-10 py-7 rounded-2xl uppercase tracking-widest transition-all"
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <ArrowLeft className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
