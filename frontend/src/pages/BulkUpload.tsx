import {
  type FormEvent,
  useState,
} from "react";

import BulkResultsTable from "../components/BulkResultsTable";
import BulkSummaryCards from "../components/BulkSummaryCards";
import BulkUploadForm from "../components/BulkUploadForm";
import ErrorAlert from "../components/ErrorAlert";
import InvalidEntriesTable from "../components/InvalidEntriesTable";
import LoadingSpinner from "../components/LoadingSpinner";

import {
  analyzeBulkFile,
  exportBulkCsv,
} from "../services/api";

import type {
  BulkAnalysisResponse,
} from "../types/bulkAnalysis";


function BulkUpload() {
  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    bulkResult,
    setBulkResult,
  ] =
    useState<BulkAnalysisResponse | null>(
      null,
    );

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    isExporting,
    setIsExporting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);


  function handleFileChange(
    file: File | null,
  ) {
    setSelectedFile(file);
    setBulkResult(null);
    setError(null);
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedFile) {
      setError(
        "Select a text file before uploading.",
      );
      return;
    }

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".txt")
    ) {
      setError(
        "Only .txt files are supported.",
      );
      return;
    }

    setIsUploading(true);
    setError(null);
    setBulkResult(null);

    try {
      const result =
        await analyzeBulkFile(
          selectedFile,
        );

      setBulkResult(result);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Bulk analysis failed.";

      setError(message);
    } finally {
      setIsUploading(false);
    }
  }


  async function handleExportCsv() {
    if (!bulkResult?.results.length) {
      setError(
        "There are no valid results to export.",
      );
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      await exportBulkCsv(
        bulkResult.results,
      );
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to export CSV.";

      setError(message);
    } finally {
      setIsExporting(false);
    }
  }


  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-sm text-cyan-300">
            Batch investigation
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Bulk IP analysis
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Upload a text file and analyze
            multiple IP addresses using all
            configured intelligence providers.
          </p>
        </header>

        <BulkUploadForm
          selectedFile={selectedFile}
          isUploading={isUploading}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
        />

        {error && (
          <ErrorAlert message={error} />
        )}

        {isUploading && (
          <LoadingSpinner />
        )}

        {!isUploading &&
          bulkResult && (
            <section className="mt-8 space-y-8">
              <BulkSummaryCards
                bulkResult={bulkResult}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void handleExportCsv();
                  }}
                  disabled={
                    isExporting ||
                    bulkResult.results.length ===
                      0
                  }
                  className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isExporting
                    ? "Exporting..."
                    : "Download results CSV"}
                </button>
              </div>

              <BulkResultsTable
                results={
                  bulkResult.results
                }
              />

              <InvalidEntriesTable
                entries={
                  bulkResult
                    .invalid_entries
                }
              />
            </section>
          )}
      </div>
    </main>
  );
}


export default BulkUpload;