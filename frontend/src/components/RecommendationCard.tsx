interface RecommendationCardProps {
  recommendation: string;
  riskLevel: string;
}


function getHeading(
  riskLevel: string,
): string {
  switch (riskLevel.toLowerCase()) {
    case "critical":
      return "Immediate response required";

    case "high":
      return "Restrict and investigate";

    case "medium":
      return "Further investigation advised";

    case "low":
      return "Continue monitoring";

    default:
      return "No immediate action required";
  }
}


function RecommendationCard({
  recommendation,
  riskLevel,
}: RecommendationCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6">
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Recommended action
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          {getHeading(riskLevel)}
        </h2>

        <p className="mt-4 leading-7 text-slate-300">
          {recommendation}
        </p>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm leading-6 text-slate-500">
            This recommendation is based on the
            combined threat score and indicators
            returned by the configured intelligence
            providers.
          </p>
        </div>
      </div>
    </article>
  );
}


export default RecommendationCard;