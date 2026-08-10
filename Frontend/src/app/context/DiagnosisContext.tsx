"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { SymptomInput, DiagnosisOutput, DiagnosisCase, CaseMetadata } from "../engine/types";
import { useAuth } from "./AuthContext";

interface DiagnosisContextValue {
  selectedSymptoms: SymptomInput[];
  addSymptom: (id: number) => void;
  removeSymptom: (id: number) => void;
  setConfidence: (id: number, value: number) => void;
  clearSymptoms: () => void;
  lastResult: DiagnosisOutput | null;
  setLastResult: (result: DiagnosisOutput | null) => void;
  savedCases: DiagnosisCase[];
  saveCase: (output: DiagnosisOutput, meta: CaseMetadata, userId: string, userName: string) => Promise<DiagnosisCase | null>;
  deleteCase: (caseId: string) => Promise<void>;
  getCaseById: (id: string) => DiagnosisCase | undefined;
  refreshCases: () => Promise<void>;
  loading: boolean;
}

const DiagnosisContext = createContext<DiagnosisContextValue | null>(null);

const STORAGE_KEY = "palmcare_cases";

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomInput[]>([]);
  const [lastResult, setLastResult] = useState<DiagnosisOutput | null>(null);
  const [savedCases, setSavedCases] = useState<DiagnosisCase[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage first
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setSavedCases(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Fetch from API when user changes
  useEffect(() => {
    if (user) {
      refreshCases();
    }
  }, [user]);

  const refreshCases = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/riwayat?userId=${user.id}`);
      if (response.ok) {
        const { data } = await response.json();
        // Transform API format to DiagnosisCase
        const transformed: DiagnosisCase[] = data.map((r: any) => ({
          caseId: r.id.toString(),
          userId: r.userId.toString(),
          userName: r.user.nama,
          metadata: { plotId: "Umum", notes: "-", timestamp: r.createdAt },
          output: {
            caseId: r.id.toString(),
            timestamp: r.createdAt,
            diagnosisTimeMs: 0,
            emergencyFlag: r.hasil.some((h: any) => h.cfHasil >= 0.7),
            inputs: [], // API doesn't return inputs yet
            diagnoses: r.hasil.map((h: any) => ({
              diseaseId: h.penyakitId,
              diseaseName: h.penyakit.nama,
              cfScore: h.cfHasil,
              cfPercent: Math.round(h.cfHasil * 100),
              severity: "medium",
              treatmentId: 1,
              rulesTraced: []
            }))
          }
        }));
        setSavedCases(transformed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transformed));
      }
    } catch (error) {
      console.error("Error refreshing cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (id: number) => {
    setSelectedSymptoms((prev) =>
      prev.some((s) => s.symptomId === id) ? prev : [...prev, { symptomId: id, userConfidence: 0.7 }]
    );
  };

  const removeSymptom = (id: number) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s.symptomId !== id));
  };

  const setConfidence = (id: number, value: number) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.symptomId === id ? { ...s, userConfidence: value } : s))
    );
  };

  const clearSymptoms = () => setSelectedSymptoms([]);

  const saveCase = async (output: DiagnosisOutput, meta: CaseMetadata, userId: string, userName: string): Promise<DiagnosisCase | null> => {
    // If diagnosis was done via API, it's already saved.
    // This is for local fallback or manual saves.
    try {
      const response = await fetch("/api/riwayat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          diagnosaResults: output.diagnoses
        })
      });
      
      if (response.ok) {
        await refreshCases();
        return savedCases[0]; // Most recent
      }
    } catch (error) {
      console.error("Error saving case to API:", error);
    }

    const newCase: DiagnosisCase = { caseId: output.caseId, userId, userName, metadata: meta, output };
    setSavedCases((prev) => {
      const updated = [newCase, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return newCase;
  };

  const deleteCase = async (caseId: string) => {
    try {
      // If it's a numeric ID (from API)
      if (!isNaN(parseInt(caseId))) {
        await fetch(`/api/riwayat?id=${caseId}`, { method: "DELETE" });
      }
    } catch (error) {
      console.error("Error deleting case from API:", error);
    }
    
    setSavedCases((prev) => {
      const updated = prev.filter((c) => c.caseId !== caseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getCaseById = (id: string) => savedCases.find((c) => c.caseId === id);

  return (
    <DiagnosisContext.Provider value={{ selectedSymptoms, addSymptom, removeSymptom, setConfidence, clearSymptoms, lastResult, setLastResult, savedCases, saveCase, deleteCase, getCaseById, refreshCases, loading }}>
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) throw new Error("useDiagnosis must be used within DiagnosisProvider");
  return ctx;
}
