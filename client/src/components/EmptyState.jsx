import { InboxIcon } from './Icons';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <InboxIcon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}