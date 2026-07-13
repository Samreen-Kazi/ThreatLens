import type {
  DashboardAnalytics,
} from "../types/analytics";


interface TopInsightsProps {
  analytics: DashboardAnalytics;
}


function TopInsights({
  analytics,
}: TopInsightsProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
        Historical context
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-white">
        Top intelligence insights
      </h2>

      <div className="mt-6 space-y-5">
        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Most common country
          </p>

          <p className="mt-3 text-xl font-semibold text-white">
            {analytics.top_country ??
              "No data"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {analytics.top_country_count} saved
            analyses
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Most common organization
          </p>

          <p className="mt-3 break-words text-xl font-semibold text-white">
            {analytics.top_organization ??
              "No data"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {analytics.top_organization_count}{" "}
            saved analyses
          </p>
        </div>
      </div>
    </article>
  );
}


export default TopInsights;