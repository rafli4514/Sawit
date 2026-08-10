"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import { AppSidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [user, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-[#006837] animate-spin mx-auto" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memvalidasi Sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      
      <SidebarInset className="flex flex-col min-h-screen bg-slate-50/50">
        
        <Navbar />
        
        <div className="flex-1 flex flex-col p-4 md:p-6">
          {children}
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
}