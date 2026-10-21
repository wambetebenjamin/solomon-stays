"use client";

export const CHART_COLORS = {
  red: "#ff0909",
  navy: "#0f1521",
  ink: "#121212",
  silver: "#a3aec6",
  grey: "#767676",
  line: "#e4e6ea",
  occupied: "#b6791f",
  available: "#1f7a4d",
  reserved: "#245a8d",
};

export const SERIES_COLORS = [CHART_COLORS.red, CHART_COLORS.navy, CHART_COLORS.silver, CHART_COLORS.grey];

export const AXIS_PROPS = {
  stroke: "#e4e6ea",
  tick: { fill: "#767676", fontSize: 11 },
  tickLine: false,
} as const;

interface TooltipEntry {
  name?: string | number;
  value?: number | string | Array<number | string>;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  formatter?: (value: number, name: string) => string;
  labelPrefix?: string;
}

export function ChartTooltip({ active, payload, label, formatter, labelPrefix }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="ss-tooltip">
      {label !== undefined && (
        <div className="ss-tooltip-title">
          {labelPrefix ? `${labelPrefix} ` : ""}
          {String(label)}
        </div>
      )}
      {payload.map((entry) => {
        const numeric = typeof entry.value === "number" ? entry.value : Number(entry.value ?? 0);
        return (
          <div className="ss-tooltip-row" key={`${entry.dataKey ?? entry.name}`}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i style={{ width: 8, height: 8, background: entry.color ?? CHART_COLORS.red, display: "inline-block" }} />
              {String(entry.name ?? entry.dataKey)}
            </span>
            <b>{formatter ? formatter(numeric, String(entry.name ?? entry.dataKey)) : numeric.toLocaleString("en-KE")}</b>
          </div>
        );
      })}
    </div>
  );
}
