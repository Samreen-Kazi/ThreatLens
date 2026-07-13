import type {
  DashboardAnalytics,
} from "../types/analytics";


interface AnalyticsCardsProps {
  analytics: DashboardAnalytics;
}


interface AnalyticsCardProps {
  label: string;
  value: string;
  description: string;
  emphasis?: "normal" | "warning" | "danger";
}


function getValueClasses(
  emphasis: AnalyticsCardProps["emphasis"],
): string {
  switch (emphasis) {
    case "danger":
      return "text-red-300";

    case "warning":
      return "text-orange-300";

    default:
      return "text-white";
  }
}


function AnalyticsCard({
  label,
  value,
  description,
  emphasis = "normal",
}: AnalyticsCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-semibold ${getValueClasses(
          emphasis,
        )}`}
      >
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}


function AnalyticsCards({
  analytics,
}: AnalyticsCardsProps) {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Investigation overview
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Dashboard analytics
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          label="Total analyses"
          value={String(
            analytics.total_searches,
          )}
          description="Saved investigation events"
        />

        <AnalyticsCard
          label="Average score"
          value={`${analytics.average_threat_score}/100`}
          description="Average risk across history"
        />

        <AnalyticsCard
          label="High-risk findings"
          value={String(
            analytics.high_risk_searches,
          )}
          description="High and critical results"
          emphasis="warning"
        />

        <AnalyticsCard
          label="Critical findings"
          value={String(
            analytics.critical_searches,
          )}
          description="Results requiring immediate action"
          emphasis="danger"
        />
      </div>
    </section>
  );
}


export default AnalyticsCards;