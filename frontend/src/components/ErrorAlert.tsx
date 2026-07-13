interface ErrorAlertProps {
  message: string;
}

function ErrorAlert({
  message,
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-300"
    >
      {message}
    </div>
  );
}

export default ErrorAlert;