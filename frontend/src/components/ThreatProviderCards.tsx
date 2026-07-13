import type {
  AnalysisSources,
} from "../types/analysis";


interface ThreatProviderCardsProps {
  sources: AnalysisSources;
}


interface MetricProps {
  label: string;
  value: string | number;
  valueClasses?: string;
}


function Metric({
  label,
  value,
  valueClasses = "text-white",
}: MetricProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-semibold ${valueClasses}`}
      >
        {value}
      </p>
    </div>
  );
}


function displayValue(
  value: string | number | null,
): string | number {
  if (
    value === null ||
    value === ""
  ) {
    return "Unavailable";
  }

  return value;
}


function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Never reported";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}


function getAbuseScoreClasses(
  score: number | null,
): string {
  if (score === null) {
    return "text-slate-300";
  }

  if (score >= 75) {
    return "text-red-300";
  }

  if (score >= 50) {
    return "text-orange-300";
  }

  if (score >= 25) {
    return "text-amber-300";
  }

  return "text-emerald-300";
}


function getGreyNoiseClasses(
  classification: string | null,
): string {
  switch (
    classification?.toLowerCase()
  ) {
    case "malicious":
      return "border-red-400/20 bg-red-500/10 text-red-300";

    case "benign":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

    case "not seen":
      return "border-slate-400/20 bg-slate-500/10 text-slate-300";

    case "rate limited":
      return "border-amber-400/20 bg-amber-500/10 text-amber-300";

    default:
      return "border-sky-400/20 bg-sky-500/10 text-sky-300";
  }
}


function getPortLabel(
  port: number,
): string {
  const commonPorts: Record<
    number,
    string
  > = {
    20: "FTP Data",
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    135: "RPC",
    139: "NetBIOS",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    993: "IMAPS",
    995: "POP3S",
    1433: "MSSQL",
    1521: "Oracle",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    5900: "VNC",
    6379: "Redis",
    8080: "HTTP Alt",
    8443: "HTTPS Alt",
  };

  return commonPorts[port] ??
    "Unknown service";
}


function getPortClasses(
  port: number,
): string {
  const highRiskPorts = new Set([
    21,
    23,
    445,
    3389,
    5900,
    6379,
  ]);

  if (highRiskPorts.has(port)) {
    return "border-orange-400/20 bg-orange-500/10 text-orange-300";
  }

  return "border-cyan-400/20 bg-cyan-400/5 text-cyan-200";
}


function ThreatProviderCards({
  sources,
}: ThreatProviderCardsProps) {
  const abuseScore =
    sources.abuseipdb
      .abuse_confidence_score;

  const malicious =
    sources.virustotal.malicious;

  const suspicious =
    sources.virustotal.suspicious;

  const hasVirusTotalDetections =
    (malicious ?? 0) > 0 ||
    (suspicious ?? 0) > 0;


  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Intelligence enrichment
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Threat intelligence providers
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Review the evidence returned by each
          external threat-intelligence source.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-cyan-400/20">
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-red-500/5 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Reputation source
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  AbuseIPDB
                </h3>
              </div>

              <span
                className={`rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm font-semibold ${getAbuseScoreClasses(
                  abuseScore,
                )}`}
              >
                {displayValue(abuseScore)}
                {abuseScore !== null
                  ? "%"
                  : ""}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Metric
                label="Confidence score"
                value={
                  abuseScore !== null
                    ? `${abuseScore}/100`
                    : "Unavailable"
                }
                valueClasses={
                  getAbuseScoreClasses(
                    abuseScore,
                  )
                }
              />

              <Metric
                label="Total reports"
                value={displayValue(
                  sources.abuseipdb
                    .total_reports,
                )}
              />
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Last reported activity
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {formatDate(
                  sources.abuseipdb
                    .last_reported_at,
                )}
              </p>
            </div>

            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        abuseScore ?? 0,
                        0,
                      ),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-cyan-400/20">
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-violet-500/5 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Multi-engine detection
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  VirusTotal
                </h3>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  hasVirusTotalDetections
                    ? "border-red-400/20 bg-red-500/10 text-red-300"
                    : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {hasVirusTotalDetections
                  ? "Detections found"
                  : "No detections"}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Metric
                label="Malicious"
                value={displayValue(
                  sources.virustotal
                    .malicious,
                )}
                valueClasses="text-red-300"
              />

              <Metric
                label="Suspicious"
                value={displayValue(
                  sources.virustotal
                    .suspicious,
                )}
                valueClasses="text-amber-300"
              />

              <Metric
                label="Harmless"
                value={displayValue(
                  sources.virustotal
                    .harmless,
                )}
                valueClasses="text-emerald-300"
              />

              <Metric
                label="Undetected"
                value={displayValue(
                  sources.virustotal
                    .undetected,
                )}
                valueClasses="text-slate-300"
              />
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Reputation score
                </p>

                <p className="text-xl font-semibold text-white">
                  {displayValue(
                    sources.virustotal
                      .reputation,
                  )}
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-cyan-400/20">
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Internet noise context
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  GreyNoise
                </h3>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getGreyNoiseClasses(
                  sources.greynoise
                    .classification,
                )}`}
              >
                {sources.greynoise
                  .classification ??
                  "Unknown"}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-white/5 bg-slate-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Classification
                </p>

                <p className="mt-3 text-xl font-semibold text-white">
                  {displayValue(
                    sources.greynoise
                      .classification,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Actor or scanner name
                </p>

                <p className="mt-3 break-words text-xl font-semibold text-white">
                  {displayValue(
                    sources.greynoise.name,
                  )}
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-cyan-400/20">
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Internet exposure data
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Shodan
                </h3>
              </div>

              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold text-cyan-300">
                {
                  sources.shodan.ports
                    .length
                }{" "}
                ports
              </span>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Open ports
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {sources.shodan.ports
                  .length > 0 ? (
                  sources.shodan.ports.map(
                    (port) => (
                      <div
                        key={port}
                        title={getPortLabel(
                          port,
                        )}
                        className={`rounded-xl border px-3 py-2 ${getPortClasses(
                          port,
                        )}`}
                      >
                        <p className="font-mono text-sm font-semibold">
                          {port}
                        </p>

                        <p className="mt-1 text-[10px] opacity-70">
                          {getPortLabel(
                            port,
                          )}
                        </p>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No open ports returned.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Shodan tags
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {sources.shodan.tags.length >
                0 ? (
                  sources.shodan.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-violet-400/20 bg-violet-400/5 px-3 py-1 text-sm text-violet-200"
                      >
                        {tag}
                      </span>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No tags returned.
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}


export default ThreatProviderCards;