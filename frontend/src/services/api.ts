import type { AnalysisResponse } from "../types/analysis";
import type { HistoryEntry } from "../types/history";
import type { DashboardAnalytics } from "../types/analytics";
import type { BulkAnalysisResponse } from "../types/bulkAnalysis";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";


interface ErrorDetail {
  msg?: string;
}


interface ErrorResponse {
  detail?: string | ErrorDetail[];
}


export async function analyzeIp(
  ip: string,
): Promise<AnalysisResponse> {
  const encodedIp = encodeURIComponent(ip.trim());

  const response = await fetch(
    `${API_BASE_URL}/analyze/${encodedIp}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    let message = "The IP analysis failed.";

    try {
      const errorData =
        (await response.json()) as ErrorResponse;

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        message =
          errorData.detail
            .map((error) => error.msg)
            .filter(Boolean)
            .join(", ") || message;
      }
    } catch {
      // Keep the default error when the response is not JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as AnalysisResponse;
}

export async function getSearchHistory(
  limit = 50,
): Promise<HistoryEntry[]> {
  const response = await fetch(
    `${API_BASE_URL}/history?limit=${limit}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load search history.",
    );
  }

  return (await response.json()) as HistoryEntry[];
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const response = await fetch(
    `${API_BASE_URL}/analytics`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load dashboard analytics.",
    );
  }

  return (
    await response.json()
  ) as DashboardAnalytics;
}

export async function analyzeBulkFile(
  file: File,
): Promise<BulkAnalysisResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/analyze/bulk`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let message =
      "The bulk analysis failed.";

    try {
      const errorData =
        (await response.json()) as {
          detail?: string;
        };

      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Preserve the default message.
    }

    throw new Error(message);
  }

  return (
    await response.json()
  ) as BulkAnalysisResponse;
}

function downloadBlob(
  blob: Blob,
  filename: string,
): void {
  const objectUrl =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = objectUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(objectUrl);
}

function getDownloadFilename(
  response: Response,
  fallbackFilename: string,
): string {
  const disposition =
    response.headers.get(
      "Content-Disposition",
    );

  const match = disposition?.match(
    /filename="([^"]+)"/,
  );

  return match?.[1] ??
    fallbackFilename;
}

export async function exportHistoryCsv(): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/export/history.csv`,
    {
      method: "GET",
      headers: {
        Accept: "text/csv",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to export search history.",
    );
  }

  const blob = await response.blob();

  const filename =
    getDownloadFilename(
      response,
      "threatlens_history.csv",
    );

  downloadBlob(
    blob,
    filename,
  );
}

export async function exportBulkCsv(
  results: AnalysisResponse[],
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/export/bulk.csv`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Accept: "text/csv",
      },
      body: JSON.stringify({
        results,
      }),
    },
  );

  if (!response.ok) {
    let message =
      "Unable to export bulk results.";

    try {
      const errorData =
        (await response.json()) as {
          detail?: string;
        };

      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Preserve the default message.
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const filename =
    getDownloadFilename(
      response,
      "threatlens_bulk_results.csv",
    );

  downloadBlob(
    blob,
    filename,
  );
}

export async function exportAnalysisPdf(
  analysis: AnalysisResponse,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/export/report.pdf`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify({
        analysis,
      }),
    },
  );

  if (!response.ok) {
    let message =
      "Unable to generate the PDF report.";

    try {
      const errorData =
        (await response.json()) as {
          detail?: string;
        };

      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Preserve default message.
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const filename =
    getDownloadFilename(
      response,
      "threatlens_report.pdf",
    );

  downloadBlob(
    blob,
    filename,
  );
}