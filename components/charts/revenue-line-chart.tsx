"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-ui";
import { shortLabel } from "@/lib/dates";

interface RevenuePoint {
  date: string;
  revenue: number;
}

export function RevenueLineChart({ data, height = 280 }: { data: RevenuePoint[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 14, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => shortLabel(value)}
            interval={Math.max(1, Math.floor(data.length / 8))}
            {...AXIS_PROPS}
          />
          <YAxis
            tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            {...AXIS_PROPS}
            width={46}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(value) => `KES ${Math.round(value).toLocaleString("en-KE")}`}
                labelPrefix="Revenue"
              />
            }
          />
          <Legend verticalAlign="bottom" height={30} iconType="square" iconSize={9} />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Daily revenue"
            stroke={CHART_COLORS.red}
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
