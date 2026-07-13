import type {
  Summary,
} from "../types/analysis";


interface SummaryCardsProps {
  summary: Summary;
}


interface SummaryItemProps {
  label: string;
  value: string;
  secondary?: string;
}


function SummaryItem({
  label,
  value,
  secondary,
}: SummaryItemProps) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-3 break-all text-lg font-semibold text-white">
        {value}
      </p>

      {secondary && (
        <p className="mt-1 text-sm text-slate-500">
          {secondary}
        </p>
      )}
    </article>
  );
}


function SummaryCards({
  summary,
}: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryItem
        label="IP address"
        value={summary.ip}
        secondary="Analyzed indicator"
      />

      <SummaryItem
        label="Country"
        value={summary.country ?? "Unknown"}
        secondary="Registered location"
      />

      <SummaryItem
        label="Organization"
        value={
          summary.organization ?? "Unknown"
        }
        secondary="Network owner"
      />
    </div>
  );
}


export default SummaryCards;