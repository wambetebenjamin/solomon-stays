"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS, ChartTooltip, SERIES_COLORS } from "@/components/charts/chart-ui";
import type { ChannelSummary } from "@/lib/types";

export function SourcePieChart({ data, height = 300 }: { data: ChannelSummary[]; height?: number }) {
  const total = data.reduce((sum, entry) => sum + entry.bookings, 0);
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="bookings"
            nameKey="source"
            cx="50%"
            cy="46%"
            innerRadius="48%"
            outerRadius="72%"
            paddingAngle={1}
            isAnimationActive
            animationDuration={900}
            stroke="#ffffff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.source} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={
              <ChartTooltip
                formatter={(value) => `${value} bookings (${total > 0 ? Math.round((value / total) * 100) : 0}%)`}
              />
            }
          />
          <Legend verticalAlign="bottom" height={34} iconType="square" iconSize={9} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SourceLegendBreakdown({ data }: { data: ChannelSummary[] }) {
  const total = data.reduce((sum, entry) => sum + entry.revenue, 0);
  return (
    <div className="ss-stack" style={{ gap: 10 }}>
      {data.map((entry, index) => (
        <div key={entry.source} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: CHART_COLORS.ink }}>
            <i
              style={{
                width: 9,
                height: 9,
                background: SERIES_COLORS[index % SERIES_COLORS.length],
                display: "inline-block",
              }}
            />
            {entry.source}
          </span>
          <span style={{ color: CHART_COLORS.grey }}>
            {total > 0 ? Math.round((entry.revenue / total) * 100) : 0}% of revenue
          </span>
        </div>
      ))}
    </div>
  );
}
