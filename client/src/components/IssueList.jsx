import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge, TypeBadge } from './Badges';
import { formatDate } from '../utils/formatters';

const actionClass =
  'rounded-md px-2 py-1 text-sm font-medium transition';

export default function IssueList({ issues, currentUserId, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Priority</th>
            <th className="px-5 py-3">Created</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {issues.map((issue) => {
            // UI convenience only. The server enforces this with a 403.
            const isOwner = issue.createdBy?._id === currentUserId;

            return (
              <tr key={issue._id} className="transition hover:bg-slate-50">
                <td className="max-w-xs px-5 py-4">
                  <Link
                    to={`/issues/${issue._id}`}
                    className="font-medium text-slate-900 hover:text-indigo-600"
                  >
                    {issue.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    by {issue.createdBy?.name ?? 'Unknown'}
                  </p>
                </td>
                <td className="px-5 py-4"><TypeBadge value={issue.type} /></td>
                <td className="px-5 py-4"><StatusBadge value={issue.status} /></td>
                <td className="px-5 py-4"><PriorityBadge value={issue.priority} /></td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {formatDate(issue.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <Link
                    to={`/issues/${issue._id}`}
                    className={`${actionClass} text-slate-600 hover:bg-slate-100`}
                  >
                    View
                  </Link>
                  {isOwner && (
                    <>
                      <button
                        onClick={() => onEdit(issue)}
                        className={`${actionClass} text-indigo-600 hover:bg-indigo-50`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(issue)}
                        className={`${actionClass} text-red-600 hover:bg-red-50`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}