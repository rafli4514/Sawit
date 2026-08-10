import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      
      <SidebarInset className="peer-data-[variant=inset]:min-h-svh">
        
        <Navbar />

        <main className="flex-1 w-full flex flex-col overflow-x-hidden bg-slate-50/50">
          {children}
        </main>
        
      </SidebarInset>
    </SidebarProvider>
  );
}