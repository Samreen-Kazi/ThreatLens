interface RiskBadgeProps {
  riskLevel: string;
}


function getRiskClasses(
  riskLevel: string,
): string {
  switch (riskLevel.toLowerCase()) {
    case "critical":
      return "border-red-400/30 bg-red-500/10 text-red-300";

    case "high":
      return "border-orange-400/30 bg-orange-500/10 text-orange-300";

    case "medium":
      return "border-amber-400/30 bg-amber-500/10 text-amber-300";

    case "low":
      return "border-sky-400/30 bg-sky-500/10 text-sky-300";

    default:
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  }
}


function RiskBadge({
  riskLevel,
}: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRiskClasses(
        riskLevel,
      )}`}
    >
      {riskLevel}
    </span>
  );
}


export default RiskBadge;