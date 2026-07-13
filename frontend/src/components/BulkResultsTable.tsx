import {
  useNavigate,
} from "react-router";

import RiskBadge from "./RiskBadge";
import type {
  AnalysisResponse,
} from "../types/analysis";


interface BulkResultsTableProps {
  results: AnalysisResponse[];
}


function BulkResultsTable({
  results,
}: BulkResultsTableProps) {
  const navigate = useNavigate();


  function openAnalysis(
    analysis: AnalysisResponse,
  ) {
    navigate("/", {
      state: {
        analysis,
        ip: analysis.summary.ip,
      },
    });
  }


  if (results.length === 0) {
    return null;
  }


  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Valid indicators
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Analyzed IP addresses
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  IP
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Country
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Organization
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Score
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Risk
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {results.map((analysis) => (
                <tr
                  key={analysis.summary.ip}
                  className="transition hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-white">
                    {analysis.summary.ip}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
                    {analysis.summary.country ??
                      "Unknown"}
                  </td>

                  <td className="max-w-xs truncate px-5 py-4 text-sm text-slate-300">
                    {analysis.summary
                      .organization ?? "Unknown"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-200">
                    {
                      analysis.summary
                        .threat_score
                    }
                    /100
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <RiskBadge
                      riskLevel={
                        analysis.summary
                          .risk_level
                      }
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        openAnalysis(analysis)
                      }
                      className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


export default BulkResultsTable;