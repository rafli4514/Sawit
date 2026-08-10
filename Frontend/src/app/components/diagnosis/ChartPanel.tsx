import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { DiagnosisResult } from "../../engine/types";

const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];

interface Props {
  diagnoses: DiagnosisResult[];
}

export function ChartPanel({ diagnoses }: Props) {
  const data = diagnoses.slice(0, 5).map((d) => ({
    name: d.diseaseName.length > 22 ? d.diseaseName.slice(0, 22) + "…" : d.diseaseName,
    cf: d.cfPercent,
    severity: d.severity,
  }));

  const colorMap: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Tidak ada data untuk ditampilkan</div>;
  }

  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground mb-3">Top {data.length} diagnosis berdasarkan Faktor Kepastian (%)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
          <Tooltip formatter={(value) => [`${value}%`, "CF"]} contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="cf" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.severity] ?? COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 justify-center flex-wrap">
        {[{ label: "Tinggi", color: "#ef4444" }, { label: "Sedang", color: "#f59e0b" }, { label: "Rendah", color: "#22c55e" }].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
