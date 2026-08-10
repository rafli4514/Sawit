"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

const routeLabels: Record<string, string> = {
  "/dashboard": "Beranda",
  "/Diagnosis": "Diagnosis",
  "/kasus": "Riwayat Kasus",
  "/profile": "Profil",
  "/admin/aturan": "Aturan Pakar",
  "/admin/laporan": "Laporan Sistem",
};

function getBreadcrumb(pathname: string): { label: string; path: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [{ label: "", path: "/" }];
  if (parts.length === 0) return crumbs;
  let cumPath = "";
  for (const part of parts) {
    cumPath += "/" + part;
    const label = routeLabels[cumPath] ?? part.charAt(0).toUpperCase() + part.slice(1);
    crumbs.push({ label, path: cumPath });
  }
  return crumbs;
}

export function Navbar() {
  const pathname = usePathname();
  const crumbs = getBreadcrumb(pathname);

  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-8 bg-white border-b border-slate-200/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-10 w-10 text-slate-600 hover:bg-slate-100 rounded-xl" />
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {crumbs.map((crumb, i) => (
            <div key={crumb.path} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              <Link 
                href={crumb.path} 
                className={cn(
                  "hover:text-[#006837] transition-colors",
                  i === crumbs.length - 1 ? "text-[#006837]" : ""
                )}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-[#006837] hover:bg-green-50 relative h-10 w-10">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 h-2 w-2 bg-[#8DC63F] rounded-full border-2 border-white" />
      </Button>
    </header>
  );
}

// Helper needed for conditional class logic (importing 'cn' from ui/utils locally)
import { cn } from "../ui/utils";
