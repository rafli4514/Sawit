"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, UserRole } from "../engine/types";

interface AuthContextValue {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("palmcare_user");
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("palmcare_user", JSON.stringify(user));
    else localStorage.removeItem("palmcare_user");
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("palmcare_user");
  };

  const isRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    // Normalize role string case just in case
    const userRole = user.role.toUpperCase() as UserRole;
    if (Array.isArray(role)) {
      return role.some(r => r.toUpperCase() === userRole);
    }
    return userRole === role.toUpperCase();
  };

  return <AuthContext.Provider value={{ user, login, logout, isRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
