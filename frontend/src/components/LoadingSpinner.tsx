function LoadingSpinner() {
  return (
    <div
      role="status"
      className="mt-8 flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 p-10"
    >
      <div className="flex items-center gap-4">
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />

        <p className="text-slate-300">
          Gathering threat intelligence...
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;