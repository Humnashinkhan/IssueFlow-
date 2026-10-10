import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge, TypeBadge } from './Badges';
import { formatDate } from '../utils/formatters';

export default function IssueList({ issues, currentUserId, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {issues.map((issue) => {
            // UI convenience only. The server enforces this with a 403.
            const isOwner = issue.createdBy?._id === currentUserId;

            return (
              <tr key={issue._id} className="hover:bg-gray-50">
                <td className="max-w-xs px-4 py-3">
                  <Link
                    to={`/issues/${issue._id}`}
                    className="font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {issue.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    by {issue.createdBy?.name ?? 'Unknown'}
                  </p>
                </td>
                <td className="px-4 py-3"><TypeBadge value={issue.type} /></td>
                <td className="px-4 py-3"><StatusBadge value={issue.status} /></td>
                <td className="px-4 py-3"><PriorityBadge value={issue.priority} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {formatDate(issue.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    to={`/issues/${issue._id}`}
                    className="mr-3 text-gray-600 hover:text-gray-900"
                  >
                    View
                  </Link>
                  {isOwner && (
                    <>
                      <button
                        onClick={() => onEdit(issue)}
                        className="mr-3 text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(issue)}
                        className="text-red-600 hover:underline"
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