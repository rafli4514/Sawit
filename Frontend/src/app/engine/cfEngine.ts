import type { Rule, SymptomInput, Disease, DiagnosisOutput, DiagnosisResult, FiredRule, SimulationResult } from "./types";

function combineCF(cf1: number, cf2: number): number {
  // Rumus kombinasi Certainty Factor (Iterasi CF Combine)
  // Digunakan jika terdapat lebih dari satu aturan yang merujuk pada penyakit yang sama
  if (cf1 >= 0 && cf2 >= 0) {
    // Keduanya positif: cf1 + cf2 * (1 - cf1)
    return cf1 + cf2 * (1 - cf1);
  } else if (cf1 < 0 && cf2 < 0) {
    // Keduanya negatif: cf1 + cf2 * (1 + cf1)
    return cf1 + cf2 * (1 + cf1);
  } else {
    // Salah satu negatif (campuran): (cf1 + cf2) / (1 - min(|cf1|, |cf2|))
    const minAbs = Math.min(Math.abs(cf1), Math.abs(cf2));
    return (cf1 + cf2) / (1 - minAbs);
  }
}

function ruleFires(rule: Rule, inputs: SymptomInput[]): { fires: boolean; matches: Array<{ symptomId: number; userConfidence: number }> } {
  const matches: Array<{ symptomId: number; userConfidence: number }> = [];
  // Syarat rule fires: semua anteseden harus terpenuhi (input >= minConfidence)
  // Catatan: Jika user tidak menginput gejala, confidence dianggap 0
  for (const ant of rule.antecedents) {
    const input = inputs.find((i) => i.symptomId === ant.symptomId);
    if (!input || input.userConfidence < ant.minConfidence) {
      return { fires: false, matches: [] };
    }
    matches.push({ symptomId: ant.symptomId, userConfidence: input.userConfidence });
  }
  return { fires: true, matches };
}

function computeRuleCF(matchedInputs: Array<{ symptomId: number; userConfidence: number }>, consequentCf: number): number {
  if (matchedInputs.length === 0) return 0;
  // Sesuai dokumentasi: CF[H,E] = CF[E] * CF[pakar]
  // Dimana CF[E] adalah nilai keyakinan user (biasanya diambil dari nilai minimum gejala dalam satu aturan)
  const minConfidence = Math.min(...matchedInputs.map((m) => m.userConfidence));
  return minConfidence * consequentCf;
}

export function runDiagnosis(inputs: SymptomInput[], rules: Rule[], diseases: Disease[]): DiagnosisOutput {
  const start = Date.now();
  const diseaseCFMap = new Map<number, number>();
  const diseaseRulesMap = new Map<number, FiredRule[]>();

  for (const rule of rules) {
    if (!rule.active) continue;
    const { fires, matches } = ruleFires(rule, inputs);
    if (!fires) continue;

    for (const consequent of rule.consequents) {
      const cfContribution = computeRuleCF(matches, consequent.cf);
      const existing = diseaseCFMap.get(consequent.diseaseId) ?? 0;
      const combined = existing === 0 ? cfContribution : combineCF(existing, cfContribution);
      diseaseCFMap.set(consequent.diseaseId, combined);

      const firedRule: FiredRule = {
        ruleId: rule.id,
        ruleCode: rule.code,
        ruleTitle: rule.title,
        cfContribution,
        antecedentMatches: matches,
      };
      const existing2 = diseaseRulesMap.get(consequent.diseaseId) ?? [];
      diseaseRulesMap.set(consequent.diseaseId, [...existing2, firedRule]);
    }
  }

  const diagnoses: DiagnosisResult[] = [];
  for (const [diseaseId, cfScore] of diseaseCFMap.entries()) {
    if (cfScore <= 0) continue;
    const disease = diseases.find((d) => d.id === diseaseId);
    if (!disease) continue;
    diagnoses.push({
      diseaseId,
      diseaseName: disease.name,
      cfScore: Math.min(cfScore, 1),
      cfPercent: Math.round(Math.min(cfScore, 1) * 100),
      severity: disease.severityLevel,
      treatmentId: disease.treatmentId,
      rulesTraced: diseaseRulesMap.get(diseaseId) ?? [],
    });
  }

  diagnoses.sort((a, b) => b.cfScore - a.cfScore);

  const emergencyFlag = diagnoses.some((d) => d.severity === "high" && d.cfScore >= 0.7);
  const caseId = `KASUS-${Date.now().toString(36).toUpperCase()}`;

  return {
    caseId,
    diagnoses,
    emergencyFlag,
    diagnosisTimeMs: Date.now() - start,
    inputs,
    timestamp: new Date().toISOString(),
  };
}

export function simulateSingleRule(rule: Rule, inputs: SymptomInput[]): SimulationResult {
  const { fires, matches } = ruleFires(rule, inputs);
  if (!fires) {
    const missing = rule.antecedents.filter((ant) => {
      const input = inputs.find((i) => i.symptomId === ant.symptomId);
      return !input || input.userConfidence < ant.minConfidence;
    });
    return {
      fires: false,
      antecedentMatches: rule.antecedents.map((ant) => {
        const input = inputs.find((i) => i.symptomId === ant.symptomId);
        return { symptomId: ant.symptomId, minConfidence: ant.minConfidence, userConfidence: input?.userConfidence ?? 0 };
      }),
      cfContribution: 0,
      explanation: `Aturan tidak aktif. ${missing.length} anteseden tidak terpenuhi.`,
    };
  }

  const cfContributions = rule.consequents.map((c) => computeRuleCF(matches, c.cf));
  const totalCF = cfContributions.reduce((acc, cf) => (acc === 0 ? cf : combineCF(acc, cf)), 0);

  return {
    fires: true,
    antecedentMatches: rule.antecedents.map((ant) => {
      const input = inputs.find((i) => i.symptomId === ant.symptomId);
      return { symptomId: ant.symptomId, minConfidence: ant.minConfidence, userConfidence: input?.userConfidence ?? 0 };
    }),
    cfContribution: totalCF,
    explanation: `Semua ${rule.antecedents.length} anteseden terpenuhi. Kontribusi CF: ${(totalCF * 100).toFixed(1)}%.`,
  };
}
