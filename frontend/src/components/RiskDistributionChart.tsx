import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  RiskDistribution,
} from "../types/analytics";


interface RiskDistributionChartProps {
  distribution: RiskDistribution;
}


interface ChartEntry {
  name: string;
  count: number;
  color: string;
}


function RiskDistributionChart({
  distribution,
}: RiskDistributionChartProps) {
  const chartData: ChartEntry[] = [
    {
      name: "Safe",
      count: distribution.safe,
      color: "#34d399",
    },
    {
      name: "Low",
      count: distribution.low,
      color: "#38bdf8",
    },
    {
      name: "Medium",
      count: distribution.medium,
      color: "#f59e0b",
    },
    {
      name: "High",
      count: distribution.high,
      color: "#f97316",
    },
    {
      name: "Critical",
      count: distribution.critical,
      color: "#ef4444",
    },
  ];

  const hasData = chartData.some(
    (entry) => entry.count > 0,
  );

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Historical findings
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Risk distribution
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Classification of all saved IP
          analyses.
        </p>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center">
          <p className="text-sm text-slate-500">
            Analyze an IP to generate chart data.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="rgba(148, 163, 184, 0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill:
                    "rgba(255, 255, 255, 0.03)",
                }}
                contentStyle={{
                  background: "#0f172a",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              />

              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}


export default RiskDistributionChart;