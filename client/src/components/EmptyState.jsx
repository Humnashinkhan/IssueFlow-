export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-14 text-center">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}