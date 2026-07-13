import type { FormEvent } from "react";


interface SearchFormProps {
  ip: string;
  isLoading: boolean;
  onIpChange: (value: string) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
}


function SearchForm({
  ip,
  isLoading,
  onIpChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Analyze an IP address
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter a public IPv4 or IPv6 address.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label
          htmlFor="ip-address"
          className="sr-only"
        >
          IP address
        </label>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-600">
            &gt;_
          </div>

          <input
            id="ip-address"
            type="text"
            value={ip}
            onChange={(event) =>
              onIpChange(event.target.value)
            }
            placeholder="8.8.8.8"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl border border-white/10 bg-slate-950 py-4 pl-12 pr-4 font-mono text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Analyzing..."
            : "Run analysis"}
        </button>
      </form>
    </section>
  );
}


export default SearchForm;