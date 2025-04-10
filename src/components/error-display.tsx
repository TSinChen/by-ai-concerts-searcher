type ErrorDisplayProps = {
  error: Error;
};

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div
      className="p-6 rounded-lg border border-red-200 bg-red-50"
      role="alert"
    >
      <h3 className="text-lg font-semibold text-red-700 mb-2">發生錯誤</h3>
      <p className="text-red-600">{error.message}</p>
    </div>
  );
};
