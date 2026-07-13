import type {
  IPInfo,
} from "../types/analysis";


interface NetworkCardProps {
  ipInfo: IPInfo;
}


interface DetailRowProps {
  label: string;
  value: string | null;
}


function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-slate-500">
        {label}
      </dt>

      <dd className="break-all text-sm font-medium text-slate-200 sm:max-w-[65%] sm:text-right">
        {value ?? "Unknown"}
      </dd>
    </div>
  );
}


function NetworkCard({
  ipInfo,
}: NetworkCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            IPInfo enrichment
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Network identity
          </h2>
        </div>

        <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300">
          Enriched
        </span>
      </div>

      <dl className="mt-5">
        <DetailRow
          label="Organization"
          value={ipInfo.organization}
        />

        <DetailRow
          label="ASN"
          value={ipInfo.asn}
        />

        <DetailRow
          label="city"
          value={ipInfo.city}
        />

        <DetailRow
          label="region"
          value={ipInfo.region}
        />

        <DetailRow
          label="Hostname"
          value={ipInfo.hostname}
        />

        <DetailRow
          label="Country"
          value={ipInfo.country}
        />
      </dl>
    </article>
  );
}


export default NetworkCard;