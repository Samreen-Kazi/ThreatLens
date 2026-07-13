function Header() {
  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-10 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:px-10 sm:py-14">
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

          Multi-source OSINT intelligence
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Investigate IP threats with
          <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            greater context.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
          ThreatLens combines intelligence from
          IPInfo, AbuseIPDB, VirusTotal,
          GreyNoise and Shodan to calculate risk
          and recommend an appropriate response.
        </p>

        <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            5 intelligence sources
          </span>

          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            Custom threat scoring
          </span>

          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            Search history
          </span>
        </div>
      </div>
    </header>
  );
}


export default Header;