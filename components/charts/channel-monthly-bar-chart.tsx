"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-ui";
import type { ChannelMonth } from "@/lib/types";

const BARS = [
  { key: "Direct", color: CHART_COLORS.navy },
  { key: "OTA", color: CHART_COLORS.red },
  { key: "Walk-in", color: CHART_COLORS.silver },
  { key: "Corporate", color: CHART_COLORS.grey },
] as const;

export function ChannelMonthlyBarChart({ data, height = 330 }: { data: ChannelMonth[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
          <XAxis dataKey="month" {...AXIS_PROPS} interval={0} tick={{ fill: "#767676", fontSize: 10 }} />
          <YAxis {...AXIS_PROPS} width={36} allowDecimals={false} />
          <Tooltip content={<ChartTooltip formatter={(value) => `${value} bookings`} />} />
          <Legend verticalAlign="bottom" height={30} iconType="square" iconSize={9} />
          {BARS.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.key}
              fill={bar.color}
              isAnimationActive
              animationDuration={800}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
