import { redirect } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import type { ReactNode } from "react";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
