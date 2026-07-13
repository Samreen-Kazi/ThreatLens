interface ReportActionsProps {
  isExporting: boolean;
  onExportPdf: () => void;
}


function ReportActions({
  isExporting,
  onExportPdf,
}: ReportActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div>
        <p className="text-sm font-semibold text-white">
          Investigation report
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Download the current analysis as a
          formatted PDF report.
        </p>
      </div>

      <button
        type="button"
        onClick={onExportPdf}
        disabled={isExporting}
        className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isExporting
          ? "Generating PDF..."
          : "Download PDF report"}
      </button>
    </div>
  );
}


export default ReportActions;