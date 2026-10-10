export default function Pagination({ page, totalPages, total, onPageChange }) {
  const buttonClass =
    'rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        {total} {total === 1 ? 'issue' : 'issues'}
        {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={buttonClass}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={buttonClass}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}