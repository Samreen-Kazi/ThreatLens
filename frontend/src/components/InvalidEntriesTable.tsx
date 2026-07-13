import type {
  InvalidIPEntry,
} from "../types/bulkAnalysis";


interface InvalidEntriesTableProps {
  entries: InvalidIPEntry[];
}


function InvalidEntriesTable({
  entries,
}: InvalidEntriesTableProps) {
  if (entries.length === 0) {
    return null;
  }


  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
          Validation failures
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Invalid entries
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-red-400/15 bg-red-500/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-400/10">
            <thead>
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-300/70">
                  Value
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-300/70">
                  Reason
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-400/10">
              {entries.map(
                (entry, index) => (
                  <tr
                    key={`${entry.value}-${index}`}
                  >
                    <td className="px-5 py-4 font-mono text-sm text-red-200">
                      {entry.value}
                    </td>

                    <td className="px-5 py-4 text-sm text-red-200/70">
                      {entry.reason}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


export default InvalidEntriesTable;