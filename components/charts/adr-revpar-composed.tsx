"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-ui";
import { shortLabel } from "@/lib/dates";

interface AdrRevparPoint {
  date: string;
  adr: number;
  revpar: number;
}

export function AdrRevparComposedChart({ data, height = 280 }: { data: AdrRevparPoint[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 14, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => shortLabel(value)}
            interval={Math.max(1, Math.floor(data.length / 8))}
            {...AXIS_PROPS}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            {...AXIS_PROPS}
            width={46}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            {...AXIS_PROPS}
            width={46}
          />
          <Tooltip
            content={
              <ChartTooltip formatter={(value) => `KES ${Math.round(value).toLocaleString("en-KE")}`} />
            }
          />
          <Legend verticalAlign="bottom" height={30} iconType="square" iconSize={9} />
          <Bar
            yAxisId="left"
            dataKey="adr"
            name="ADR"
            fill={CHART_COLORS.silver}
            barSize={10}
            isAnimationActive
            animationDuration={800}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revpar"
            name="RevPAR"
            stroke={CHART_COLORS.red}
            strokeWidth={2.2}
            dot={false}
            isAnimationActive
            animationDuration={1000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
