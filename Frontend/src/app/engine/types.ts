export type SeverityLevel = "low" | "medium" | "high";
export type RuleStatus = "draft" | "published" | "archived";
export type UserRole = "petani" | "pakar" | "ADMIN" | "USER";
export type SymptomCategory = "Daun" | "Batang" | "Akar" | "Pucuk" | "Buah";

export interface CertaintyTermOption {
  label: string;
  value: number;
}

export const CERTAINTY_TERMS: CertaintyTermOption[] = [
  { label: "Tidak", value: -0.25 },
  { label: "Kemungkinan Tidak", value: 0 },
  { label: "Tidak Tahu", value: 0.3 },
  { label: "Kemungkinan Iya", value: 0.5 },
  { label: "Iya", value: 0.7 },
];

export function getCertaintyLabel(val: number): string {
  const match = CERTAINTY_TERMS.find((t) => Math.abs(t.value - val) < 0.05);
  return match ? `${match.label} (${match.value})` : `${val}`;
}

export interface Symptom {
  id: number;
  code: string;
  label: string;
  description: string;
  imageUrl?: string;
  severityHint: SeverityLevel;
  category: SymptomCategory;
  active: boolean;
}

export interface Treatment {
  id: number;
  name: string;
  steps: string[];
  emergencyActions: string[];
  dosage: { chemical: string; rate: string; unit: string; per: string };
  safetyNotes: string;
}

export interface Disease {
  id: number;
  name: string;
  summary: string;
  severityLevel: SeverityLevel;
  treatmentId: number;
}

export interface RuleAntecedent {
  symptomId: number;
  minConfidence: number;
}

export interface RuleConsequent {
  diseaseId: number;
  cf: number;
}

export interface Rule {
  id: number;
  code: string;
  title: string;
  antecedents: RuleAntecedent[];
  consequents: RuleConsequent[];
  notes: string;
  active: boolean;
  version: number;
  status: RuleStatus;
  createdAt: string;
  createdBy: string;
}

export interface SymptomInput {
  symptomId: number;
  userConfidence: number;
}

export interface FiredRule {
  ruleId: number;
  ruleCode: string;
  ruleTitle: string;
  cfContribution: number;
  antecedentMatches: Array<{ symptomId: number; userConfidence: number }>;
}

export interface DiagnosisResult {
  diseaseId: number;
  diseaseName: string;
  cfScore: number;
  cfPercent: number;
  severity: SeverityLevel;
  treatmentId: number;
  rulesTraced: FiredRule[];
}

export interface DiagnosisOutput {
  caseId: string;
  diagnoses: DiagnosisResult[];
  emergencyFlag: boolean;
  diagnosisTimeMs: number;
  inputs: SymptomInput[];
  timestamp: string;
}

export interface CaseMetadata {
  plotId: string;
  notes: string;
  timestamp: string;
}

export interface DiagnosisCase {
  caseId: string;
  userId: string;
  userName: string;
  metadata: CaseMetadata;
  output: DiagnosisOutput;
  validatedBy?: string;
  validationNote?: string;
  agreement?: boolean;
  validatedDiseaseName?: string;
}

export interface User {
  id: string;
  nama: string;
  name?: string; // For compatibility
  email: string;
  role: UserRole;
}

export interface SimulationResult {
  fires: boolean;
  antecedentMatches: Array<{ symptomId: number; minConfidence: number; userConfidence: number }>;
  cfContribution: number;
  explanation: string;
}
