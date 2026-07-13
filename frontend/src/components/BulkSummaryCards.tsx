import type {
  BulkAnalysisResponse,
} from "../types/bulkAnalysis";

interface BulkSummaryCardsProps {
  bulkResult: BulkAnalysisResponse;
}

interface SummaryCardProps {
  label: string;
  value: number;
  description: string;
  valueClasses?: string;
}

function SummaryCard({
  label,
  value,
  description,
  valueClasses = "text-white",
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className={`mt-3 text-3xl font-semibold ${valueClasses}`}>
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}

function BulkSummaryCards({
  bulkResult,
}: BulkSummaryCardsProps) {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Upload Summary
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Bulk Analysis Results
        </h2>

        <p className="mt-2 text-sm text-slate-500 break-all">
          File:{" "}
          <span className="font-medium text-slate-300">
            {bulkResult.filename}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Unique Entries"
          value={bulkResult.total_entries}
          description="Non-empty unique IP addresses"
        />

        <SummaryCard
          label="Valid IPs"
          value={bulkResult.valid_count}
          description="Successfully analyzed"
          valueClasses="text-emerald-300"
        />

        <SummaryCard
          label="Invalid Entries"
          value={bulkResult.invalid_count}
          description="Failed IP validation"
          valueClasses="text-red-300"
        />

        <SummaryCard
          label="Duplicates"
          value={bulkResult.duplicate_count}
          description="Repeated lines ignored"
          valueClasses="text-amber-300"
        />
      </div>
    </section>
  );
}

export default BulkSummaryCards;