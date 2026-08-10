"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Activity,
  Leaf, 
  FolderOpen, 
  BarChart2, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  User as UserIcon,
  FlaskConical,
  Microscope,
  Users,
} from "lucide-react";
import {
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "../ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../ui/utils";
import { toast } from "sonner";

const roleLabel: Record<string, string> = {
  ADMIN: "Administrator",
  USER: "Petani",
};

// Component: Sidebar Header
// Gunakan group-data-[collapsible=icon]:hidden bawaan Shadcn UI
const SidebarHeaderSection = () => (
  <SidebarHeader className="h-[72px] flex flex-row items-center gap-3 px-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006837] to-[#8DC63F] shadow-lg shadow-green-900/20">
      <Leaf className="h-6 w-6 text-white" />
    </div>
    <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden whitespace-nowrap">
      <span className="font-black text-xl tracking-tight leading-none text-slate-900">PalmCare</span>
      <span className="text-[9px] font-black text-[#006837] tracking-[0.2em] uppercase mt-1.5">Expert System</span>
    </div>
  </SidebarHeader>
);

// Component: Sidebar Nav Item
const SidebarNavItem = ({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) => (
  <SidebarMenuItem>
    <SidebarMenuButton 
      asChild 
      isActive={isActive}
      tooltip={label}
      className={cn(
        "h-12 px-3.5 rounded-xl transition-all group font-medium relative border border-transparent",
        isActive 
          ? "bg-gradient-to-r from-green-50 to-white text-[#006837] border-slate-200/50 shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Link href={href} className="flex items-center gap-3">
        <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#006837]" : "text-slate-400 group-hover:text-slate-600")} />
        <span className="font-bold text-sm tracking-wide group-data-[collapsible=icon]:hidden">{label}</span>
        
        {/* Indikator aktif di kiri */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#8DC63F]" />
        )}
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

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

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  if (!isMounted || !user) return null;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-200/60 bg-white text-slate-900 shadow-sm">
      <SidebarHeaderSection />

      <SidebarContent className="px-3 py-6 custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-2 group-data-[collapsible=icon]:hidden">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            <SidebarNavItem href="/dashboard" icon={LayoutDashboard} label="Beranda" isActive={isActive("/dashboard")} />
            <SidebarNavItem href="/dashboard/gejala" icon={Activity} label="Diagnosis" isActive={isActive("/dashboard/gejala")} />
            <SidebarNavItem href="/dashboard/kasus" icon={FolderOpen} label="Riwayat Kasus" isActive={isActive("/dashboard/kasus")} />
            <SidebarNavItem href="/dashboard/profile" icon={UserIcon} label="Profil" isActive={isActive("/dashboard/profile")} />
          </SidebarMenu>
        </SidebarGroup>

        {user.role === "ADMIN" && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-2 group-data-[collapsible=icon]:hidden">
              Management
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
              <SidebarNavItem href="/dashboard/admin/aturan" icon={ShieldCheck} label="Aturan Pakar" isActive={isActive("/dashboard/admin/aturan")} />
              <SidebarNavItem href="/dashboard/admin/penyakit" icon={FlaskConical} label="Penyakit" isActive={isActive("/dashboard/admin/penyakit")} />
              <SidebarNavItem href="/dashboard/admin/gejala" icon={Microscope} label="Gejala" isActive={isActive("/dashboard/admin/gejala")} />
              <SidebarNavItem href="/dashboard/admin/users" icon={Users} label="Pengguna" isActive={isActive("/dashboard/admin/users")} />
              <SidebarNavItem href="/dashboard/admin/laporan" icon={BarChart2} label="Laporan Sistem" isActive={isActive("/dashboard/admin/laporan")} />
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 bg-slate-50/50 border-t border-slate-200/60">
        <div className="flex items-center gap-3 w-full p-1">
          {/* Avatar Inisial (Muncul baik saat expanded maupun collapsed) */}
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <span className="text-sm font-black text-[#006837] uppercase">
              {(user.nama || user.name || "P").charAt(0)}
            </span>
          </div>
          
          {/* Info User (Disembunyikan saat collapsed) */}
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-black text-slate-900 truncate leading-tight mb-0.5">{user.nama || user.name}</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{roleLabel[user.role] || "User"}</span>
          </div>

          {/* Tombol Logout (Disembunyikan saat collapsed agar tidak sesak) */}
          <button
            onClick={handleLogout}
            className="p-2.5 shrink-0 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all group-data-[collapsible=icon]:hidden border border-transparent hover:border-red-100"
            title="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}