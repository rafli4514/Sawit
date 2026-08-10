"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Target,
  Clock,
  Activity,
  Sparkles,
  Search,
  Loader2
} from "lucide-react";
import { cn } from "../../../components/ui/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";

const COLORS = ["#006837", "#8DC63F", "#F59E0B", "#EF4444", "#64748B"];

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Gagal ambil statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-12 w-12 text-[#006837] animate-spin mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Mengkalkulasi Laporan...</p>
      </div>
    );
  }

  const { stats, diseaseDistribution, monthlyTrend } = data;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans selection:bg-[#8DC63F]/30 selection:text-[#006837]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Floating Premium Header */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-4 md:p-6 shadow-xl shadow-slate-200/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-gradient-to-br from-[#006837] to-[#004d2c] rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-green-900/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Laporan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006837] to-[#8DC63F]">Kebun.</span>
                </h1>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pusat Analitik & Pemantauan</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 hover:text-[#006837] transition-all">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button className="h-11 bg-[#006837] hover:bg-[#004d2c] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95">
              <Download className="h-4 w-4 mr-2" /> Ekspor Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ringkasan" className="space-y-8" onValueChange={setActiveTab}>
          {/* Custom Segmented Tab Control */}
          <div className="flex items-center justify-between">
            <TabsList className="bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm h-auto flex gap-1">
              <TabsTrigger 
                value="ringkasan" 
                className="rounded-xl font-bold uppercase tracking-wider text-[10px] py-2.5 px-6 data-[state=active]:bg-[#006837] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Ringkasan Performa
              </TabsTrigger>
              <TabsTrigger 
                value="penyakit" 
                className="rounded-xl font-bold uppercase tracking-wider text-[10px] py-2.5 px-6 data-[state=active]:bg-[#006837] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Analisis Penyakit
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: RINGKASAN PERFORMA */}
          <TabsContent value="ringkasan" className="space-y-8 mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Diagnosis", value: stats.totalKasus.toLocaleString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-50", trend: "+12.5%", up: true },
                { label: "Kasus Urgen", value: stats.urgentCases.toLocaleString(), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", trend: "-2.4%", up: false },
                { label: "Petani Aktif", value: stats.totalUser.toLocaleString(), icon: Users, color: "text-[#006837]", bg: "bg-green-50", trend: "+24 User", up: true },
                { label: "Akurasi Sistem", value: `${stats.accuracy}%`, icon: Target, color: "text-[#8DC63F]", bg: "bg-lime-50", trend: "+2.1%", up: true },
              ].map((stat, i) => (
                <Card key={i} className="relative rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 bg-white hover:border-[#8DC63F]/50 transition-all group overflow-hidden">
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700 ${stat.bg}`} />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("h-12 w-12 rounded-[1rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                        <stat.icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                      <div className={cn("flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border", stat.up ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100")}>
                        {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {stat.trend}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Primary Bar Chart */}
              <Card className="rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 bg-white overflow-hidden">
                <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.1em] text-slate-900">Volume Diagnosis Masuk</CardTitle>
                    <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statistik 6 bulan terakhir</CardDescription>
                  </div>
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8DC63F" stopOpacity={1} />
                            <stop offset="100%" stopColor="#006837" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="cases" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Area Chart (Upgraded from LineChart) */}
              <Card className="rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 bg-white overflow-hidden">
                <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.1em] text-slate-900">Akurasi Engine (CF)</CardTitle>
                    <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tren kesamaan hasil pakar vs sistem</CardDescription>
                  </div>
                  <div className="h-10 w-10 bg-[#8DC63F]/10 rounded-xl flex items-center justify-center border border-[#8DC63F]/20">
                    <Sparkles className="h-4 w-4 text-[#006837]" />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006837" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#006837" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} domain={[0.6, 1]} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                        <Area 
                          type="monotone" 
                          dataKey="agreementRate" 
                          stroke="#006837" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorAccuracy)" 
                          activeDot={{ r: 6, fill: "#8DC63F", strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: ANALISIS PENYAKIT */}
          <TabsContent value="penyakit" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Distribution Pie */}
              <Card className="lg:col-span-4 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 bg-white overflow-hidden flex flex-col">
                <CardHeader className="px-8 pt-8 pb-0">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.1em] text-slate-900 text-center">Proporsi Kasus</CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex-1 flex flex-col justify-center">
                  <div className="h-[240px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={diseaseDistribution}
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={8}
                          dataKey="count"
                          stroke="none"
                        >
                          {diseaseDistribution.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2.5">
                    {diseaseDistribution.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-xs font-bold text-slate-600 truncate max-w-[140px] group-hover:text-slate-900 transition-colors">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Modern Table List */}
              <Card className="lg:col-span-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 bg-white overflow-hidden flex flex-col">
                <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.1em] text-slate-900">Ranking Ancaman Penyakit</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari penyakit..." 
                      className="h-9 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] transition-all bg-white"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 w-16">No.</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">Jenis Penyakit</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-center">Total Laporan</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 text-center w-40">Status Ancaman</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[...diseaseDistribution].sort((a,b) => b.count - a.count).map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-8 py-5 text-[11px] font-black text-slate-400 group-hover:text-[#006837] transition-colors">{String(i + 1).padStart(2, '0')}</td>
                            <td className="px-8 py-5">
                              <p className="text-sm font-bold text-slate-900">{item.name}</p>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 font-black text-[11px] rounded-lg px-3 py-1 shadow-sm">
                                {item.count}
                              </Badge>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <Badge className={cn(
                                "text-[9px] font-black uppercase tracking-widest border-none px-3 py-1.5 shadow-sm w-24 justify-center", 
                                i === 0 ? "bg-red-500 text-white" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              )}>
                                {i === 0 ? "Kritis" : "Terkendali"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
                  <Button variant="ghost" className="w-full h-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#006837] hover:bg-white hover:shadow-sm rounded-xl transition-all">
                    Unduh Rincian Lengkap <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
