export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
      <span className="text-sm">{message}</span>
    </div>
  );
}