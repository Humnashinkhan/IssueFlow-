export default function Pagination({ page, totalPages, total, onPageChange }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">
        {total} {total === 1 ? 'issue' : 'issues'}
        {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}