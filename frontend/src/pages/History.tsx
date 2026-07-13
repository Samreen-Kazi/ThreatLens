import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";

import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import RiskBadge from "../components/RiskBadge";

import {
  analyzeIp,
  exportHistoryCsv,
  getSearchHistory,
} from "../services/api";

import type {
  HistoryEntry,
} from "../types/history";


function formatDate(
  dateValue: string,
): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString();
}


function History() {
  const navigate = useNavigate();

  const [history, setHistory] =
    useState<HistoryEntry[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [analyzingIp, setAnalyzingIp] =
    useState<string | null>(null);

  const [isExporting, setIsExporting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadHistory =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const entries =
          await getSearchHistory(100);

        setHistory(entries);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load history.";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }, []);


  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);


  async function handleAnalyzeAgain(
    ip: string,
  ) {
    setAnalyzingIp(ip);
    setError(null);

    try {
      const analysis =
        await analyzeIp(ip);

      navigate("/", {
        state: {
          analysis,
          ip,
        },
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to analyze this IP.";

      setError(message);
    } finally {
      setAnalyzingIp(null);
    }
  }


  async function handleExportHistory() {
    if (history.length === 0) {
      setError(
        "There is no search history to export.",
      );
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      await exportHistoryCsv();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to export history.";

      setError(message);
    } finally {
      setIsExporting(false);
    }
  }


  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-sm text-cyan-300">
              Stored analyses
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Search history
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Review previously analyzed IP
              addresses, re-run investigations,
              and export your saved search
              history.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void handleExportHistory();
              }}
              disabled={
                isExporting ||
                isLoading ||
                history.length === 0
              }
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExporting
                ? "Exporting..."
                : "Download CSV"}
            </button>

            <button
              type="button"
              onClick={() => {
                void loadHistory();
              }}
              disabled={isLoading}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Refreshing..."
                : "Refresh history"}
            </button>
          </div>
        </div>

        {error && (
          <ErrorAlert message={error} />
        )}

        {isLoading && (
          <LoadingSpinner />
        )}

        {!isLoading &&
          history.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-10 text-center">
              <h2 className="text-xl font-semibold text-white">
                No searches yet
              </h2>

              <p className="mt-2 text-slate-400">
                Analyze an IP address from the
                Dashboard or Bulk Upload page,
                and it will appear here.
              </p>
            </div>
          )}

        {!isLoading &&
          history.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-950/70">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        IP address
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

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Analyzed
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {history.map((entry) => (
                      <tr
                        key={entry.id}
                        className="transition hover:bg-white/[0.03]"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-white">
                          {entry.ip}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
                          {entry.country ??
                            "Unknown"}
                        </td>

                        <td className="max-w-xs truncate px-5 py-4 text-sm text-slate-300">
                          {entry.organization ??
                            "Unknown"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-200">
                          {entry.threat_score}
                          /100
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <RiskBadge
                            riskLevel={
                              entry.risk_level
                            }
                          />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                          {formatDate(
                            entry.created_at,
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              void handleAnalyzeAgain(
                                entry.ip,
                              );
                            }}
                            disabled={
                              analyzingIp !== null
                            }
                            className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {analyzingIp ===
                            entry.ip
                              ? "Analyzing..."
                              : "Analyze again"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}


export default History;