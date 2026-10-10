export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-slate-500">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}