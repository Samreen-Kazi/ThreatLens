interface ThreatScoreGaugeProps {
  score: number;
  riskLevel: string;
}


interface RiskTheme {
  stroke: string;
  text: string;
  background: string;
  border: string;
}


function getRiskTheme(
  riskLevel: string,
): RiskTheme {
  switch (riskLevel.toLowerCase()) {
    case "critical":
      return {
        stroke: "#ef4444",
        text: "text-red-300",
        background: "bg-red-500/10",
        border: "border-red-400/20",
      };

    case "high":
      return {
        stroke: "#f97316",
        text: "text-orange-300",
        background: "bg-orange-500/10",
        border: "border-orange-400/20",
      };

    case "medium":
      return {
        stroke: "#f59e0b",
        text: "text-amber-300",
        background: "bg-amber-500/10",
        border: "border-amber-400/20",
      };

    case "low":
      return {
        stroke: "#38bdf8",
        text: "text-sky-300",
        background: "bg-sky-500/10",
        border: "border-sky-400/20",
      };

    default:
      return {
        stroke: "#34d399",
        text: "text-emerald-300",
        background: "bg-emerald-500/10",
        border: "border-emerald-400/20",
      };
  }
}


function ThreatScoreGauge({
  score,
  riskLevel,
}: ThreatScoreGaugeProps) {
  const safeScore = Math.min(
    Math.max(score, 0),
    100,
  );

  const radius = 74;
  const circumference =
    2 * Math.PI * radius;

  const progress =
    circumference -
    (safeScore / 100) * circumference;

  const theme = getRiskTheme(riskLevel);

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border ${theme.border} ${theme.background} p-6`}
    >
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/[0.03] blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Overall threat score
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Risk assessment
            </h2>
          </div>

          <span
            className={`rounded-full border ${theme.border} px-3 py-1 text-xs font-semibold uppercase tracking-wider ${theme.text}`}
          >
            {riskLevel}
          </span>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="relative h-52 w-52">
            <svg
              viewBox="0 0 180 180"
              className="-rotate-90"
              aria-label={`Threat score ${safeScore} out of 100`}
            >
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="rgba(148, 163, 184, 0.12)"
                strokeWidth="14"
              />

              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={theme.stroke}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tight text-white">
                {safeScore}
              </span>

              <span className="mt-1 text-sm text-slate-500">
                out of 100
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-5 gap-1 text-center text-[10px] uppercase tracking-wider text-slate-600">
          <span>Safe</span>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Critical</span>
        </div>
      </div>
    </article>
  );
}


export default ThreatScoreGauge;