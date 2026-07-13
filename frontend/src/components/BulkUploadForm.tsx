import {
  type ChangeEvent,
  type FormEvent,
  useRef,
} from "react";


interface BulkUploadFormProps {
  selectedFile: File | null;
  isUploading: boolean;
  onFileChange: (
    file: File | null,
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
}


function BulkUploadForm({
  selectedFile,
  isUploading,
  onFileChange,
  onSubmit,
}: BulkUploadFormProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);


  function handleFileInput(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    onFileChange(file);
  }


  function clearFile() {
    onFileChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }


  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
      <form onSubmit={onSubmit}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Batch investigation
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Upload an IP list
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Upload a UTF-8 text file containing
            one IPv4 or IPv6 address per line.
            Blank lines and duplicate values are
            handled automatically.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-7">
          <input
            ref={inputRef}
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileInput}
            className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
          />

          <p className="mt-3 text-xs text-slate-600">
            Maximum 100 unique IP addresses.
          </p>
        </div>

        {selectedFile && (
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-white">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {Math.ceil(
                  selectedFile.size / 1024,
                )}{" "}
                KB
              </p>
            </div>

            <button
              type="button"
              onClick={clearFile}
              disabled={isUploading}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={
            !selectedFile ||
            isUploading
          }
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-6 py-4 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isUploading
            ? "Analyzing file..."
            : "Run bulk analysis"}
        </button>
      </form>
    </section>
  );
}


export default BulkUploadForm;