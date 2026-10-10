import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchIssue, updateIssue, deleteIssue } from '../services/issueService';
import { getApiError } from '../utils/errors';
import { formatDateTime } from '../utils/formatters';
import { ISSUE_STATUSES } from '../utils/constants';
import { StatusBadge, PriorityBadge, TypeBadge } from '../components/Badges';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import IssueForm from '../components/IssueForm';

function MetaItem({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export default function IssueDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchIssue(id);
        if (!ignore) setIssue(result);
      } catch (err) {
        if (!ignore) setError(getApiError(err).message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const handleStatusChange = async (e) => {
    setActionError('');
    setStatusSaving(true);
    try {
      const updated = await updateIssue(issue._id, { status: e.target.value });
      setIssue(updated);
    } catch (err) {
      setActionError(getApiError(err).message);
    } finally {
      setStatusSaving(false);
    }
  };

  // Called by IssueForm. If this throws, the form shows the error.
  const handleSave = async (payload) => {
    const updated = await updateIssue(issue._id, payload);
    setIssue(updated);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${issue.title}"? This cannot be undone.`)) return;

    setActionError('');
    try {
      await deleteIssue(issue._id);
      navigate('/issues', { replace: true });
    } catch (err) {
      setActionError(getApiError(err).message);
    }
  };

  const backLink = (
    <Link to="/issues" className="text-sm font-medium text-indigo-600 hover:underline">
      &larr; Back to issues
    </Link>
  );

  if (loading) return <Loading message="Loading issue..." />;

  if (error) {
    return (
      <div className="space-y-4">
        {backLink}
        <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    );
  }

  // UI convenience only. The server enforces this with a 403.
  const isOwner = issue.createdBy?._id === user?._id;

  return (
    <div className="space-y-4">
      {backLink}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-gray-900">{issue.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <TypeBadge value={issue.type} />
              <StatusBadge value={issue.status} />
              <PriorityBadge value={issue.priority} />
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {actionError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Description
        </h2>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800">
          {issue.description}
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
          <MetaItem label="Created by">
            {issue.createdBy?.name ?? 'Unknown'}
            {issue.createdBy?.email && (
              <span className="block text-xs text-gray-500">{issue.createdBy.email}</span>
            )}
          </MetaItem>
          <MetaItem label="Created">{formatDateTime(issue.createdAt)}</MetaItem>
          <MetaItem label="Last updated">{formatDateTime(issue.updatedAt)}</MetaItem>
        </dl>

        {isOwner && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <label
              htmlFor="status"
              className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Update status
            </label>
            <select
              id="status"
              value={issue.status}
              onChange={handleStatusChange}
              disabled={statusSaving}
              className="mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {ISSUE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {statusSaving && <span className="ml-3 text-sm text-gray-500">Saving...</span>}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title="Edit Issue" onClose={() => setModalOpen(false)}>
          <IssueForm
            issue={issue}
            submitLabel="Save changes"
            onSubmit={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}