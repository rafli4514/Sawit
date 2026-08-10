"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ArrowUpRight,
  PlusCircle,
  History,
  ShieldAlert,
  Zap,
  Leaf,
  Users,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Gagal ambil statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  const isAdmin = user?.role === "ADMIN";

  const stats = [
    { label: isAdmin ? "Total Diagnosis" : "Diagnosis Saya", value: dashboardData?.stats?.totalKasus || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Penyakit Terdata", value: dashboardData?.stats?.totalPenyakit || 0, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
    { label: "Gejala Terdata", value: dashboardData?.stats?.totalGejala || 0, icon: Database, color: "text-emerald-600", bg: "bg-emerald-50" },
    ...(isAdmin ? [{ label: "Total User", value: dashboardData?.stats?.totalUser || 0, icon: Users, color: "text-amber-600", bg: "bg-amber-50" }] : []),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006837] to-[#8DC63F]">
              {user?.nama || "Pakar"}
            </span>
          </h1>
          <p className="text-slate-500 mt-1">Ringkasan performa sistem dan aktivitas terkini.</p>
        </div>

        <Button asChild size="lg" className="bg-[#006837] hover:bg-[#004d2c] text-white rounded-xl shadow-lg shadow-green-900/10">
          <Link href="/dashboard/gejala">
            <PlusCircle className="mr-2 h-4 w-4" /> Diagnosis Baru
          </Link>
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-[#8DC63F]" /> Aktifitas Terakhir
          </CardTitle>
          <Button variant="ghost" asChild className="text-xs text-[#006837] hover:text-[#004d2c] hover:bg-green-50 rounded-xl">
            <Link href="/dashboard/kasus">Lihat Semua</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-10 text-center text-slate-400 font-medium">Memuat aktifitas...</div>
            ) : dashboardData?.recentRiwayat?.length > 0 ? (
              dashboardData.recentRiwayat.map((riwayat: any) => (
                <Link key={riwayat.id} href={`/dashboard/hasil/${riwayat.id}`} className="flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {riwayat.hasil[0]?.penyakit?.nama || "Tidak Terdeteksi"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Oleh: {riwayat.user.nama} • {new Date(riwayat.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#006837] bg-green-50 px-2 py-1 rounded-md">
                      {Math.round((riwayat.hasil[0]?.cfHasil || 0) * 100)}%
                    </span>
                    <div className="p-2 rounded-lg bg-slate-100">
                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 font-medium">Belum ada aktifitas diagnosis.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}