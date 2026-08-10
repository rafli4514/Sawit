import { redirect } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
