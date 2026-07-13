import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router";

import AnalyticsCards from "../components/AnalyticsCards";
import ErrorAlert from "../components/ErrorAlert";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import NetworkCard from "../components/NetworkCard";
import RecommendationCard from "../components/RecommendationCard";
import ReportActions from "../components/ReportActions";
import RiskDistributionChart from "../components/RiskDistributionChart";
import SearchForm from "../components/SearchForm";
import SummaryCards from "../components/SummaryCards";
import ThreatProviderCards from "../components/ThreatProviderCards";
import ThreatScoreGauge from "../components/ThreatScoreGauge";
import TopInsights from "../components/TopInsights";
import IPLocationMap from "../components/IPLocationMap";

import {
  analyzeIp,
  exportAnalysisPdf,
  getDashboardAnalytics,
} from "../services/api";

import type { AnalysisResponse } from "../types/analysis";
import type { DashboardAnalytics } from "../types/analytics";

interface DashboardLocationState {
  analysis?: AnalysisResponse;
  ip?: string;
}

function Dashboard() {
  const location = useLocation();

  const [ip, setIp] = useState("");

  const [analysis, setAnalysis] =
    useState<AnalysisResponse | null>(null);

  const [analytics, setAnalytics] =
    useState<DashboardAnalytics | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isExportingPdf, setIsExportingPdf] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [analyticsError, setAnalyticsError] =
    useState<string | null>(null);

  useEffect(() => {
    const state =
      location.state as DashboardLocationState | null;

    if (state?.ip) {
      setIp(state.ip);
    }

    if (state?.analysis) {
      setAnalysis(state.analysis);
      setError(null);

      void loadAnalytics();
    }
  }, [location.key, location.state]);

  async function loadAnalytics() {
    try {
      const analyticsResult =
        await getDashboardAnalytics();

      setAnalytics(analyticsResult);
      setAnalyticsError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load dashboard analytics.";

      setAnalyticsError(message);
    }
  }

  useEffect(() => {
    void loadAnalytics();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedIp = ip.trim();

    if (!trimmedIp) {
      setError("Enter an IP address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result =
        await analyzeIp(trimmedIp);

      setAnalysis(result);

      await loadAnalytics();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExportPdf() {
    if (!analysis) {
      setError(
        "Run an analysis before exporting a report.",
      );
      return;
    }

    setIsExportingPdf(true);
    setError(null);

    try {
      await exportAnalysisPdf(
        analysis,
      );
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate PDF report.";

      setError(message);
    } finally {
      setIsExportingPdf(false);
    }
  }

  function handleIpChange(
    value: string,
  ) {
    setIp(value);

    if (error) {
      setError(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Header />

        <SearchForm
          ip={ip}
          isLoading={isLoading}
          onIpChange={handleIpChange}
          onSubmit={handleSubmit}
        />

        {error && (
          <ErrorAlert message={error} />
        )}

        {analyticsError && (
          <ErrorAlert
            message={analyticsError}
          />
        )}

        {analytics && (
          <section className="mt-8 space-y-6">
            <AnalyticsCards
              analytics={analytics}
            />

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <RiskDistributionChart
                distribution={
                  analytics.risk_distribution
                }
              />

              <TopInsights
                analytics={analytics}
              />
            </div>
          </section>
        )}

        {isLoading && (
          <LoadingSpinner />
        )}

        {!isLoading && analysis && (
          <section className="mt-8 space-y-8">
            <ReportActions
              isExporting={isExportingPdf}
              onExportPdf={() => {
                void handleExportPdf();
              }}
            />

            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <ThreatScoreGauge
                score={
                  analysis.summary.threat_score
                }
                riskLevel={
                  analysis.summary.risk_level
                }
              />

              <div className="space-y-6">
                <SummaryCards
                  summary={analysis.summary}
                />

                <RecommendationCard
                  recommendation={
                    analysis.summary
                      .recommendation
                  }
                  riskLevel={
                    analysis.summary
                      .risk_level
                  }
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
            <NetworkCard
              ipInfo={
                analysis.sources.ipinfo
              }
            />
            <IPLocationMap
              ipInfo={
                analysis.sources.ipinfo
              }
            />
            </div>

            <ThreatProviderCards
              sources={
                analysis.sources
              }
            />
          </section>
        )}

        {!isLoading &&
          !analysis &&
          !error && (
            <section className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                <p className="text-sm font-medium text-cyan-300">
                  Multi-source analysis
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Query five threat intelligence
                  providers through one unified
                  workflow.
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                <p className="text-sm font-medium text-cyan-300">
                  Custom risk scoring
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Convert raw indicators into a
                  meaningful threat score and
                  risk level.
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                <p className="text-sm font-medium text-cyan-300">
                  Investigation history
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review previous searches and
                  instantly analyze them again.
                </p>
              </article>
            </section>
          )}
      </div>
    </main>
  );
}

export default Dashboard;