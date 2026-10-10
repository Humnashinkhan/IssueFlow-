import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  fetchIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../services/issueService';
import { getApiError } from '../utils/errors';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import IssueForm from '../components/IssueForm';
import IssueFilters from '../components/IssueFilters';
import IssueList from '../components/IssueList';
import Pagination from '../components/Pagination';
import { PlusIcon } from '../components/Icons';

const PAGE_SIZE = 10;
const EMPTY_FILTERS = { status: '', priority: '', type: '', sort: 'newest' };

export default function Issues() {
  const { user } = useAuth();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState(''); // what the user types
  const [search, setSearch] = useState(''); // what we send to the API
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ issues: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [modal, setModal] = useState({ open: false, issue: null });

  // Wait 400ms after the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch whenever filters, search, page, or reloadKey change
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchIssues({ ...filters, search, page, limit: PAGE_SIZE });
        if (!ignore) setData(result);
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
  }, [filters, search, page, reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const openCreate = () => setModal({ open: true, issue: null });
  const openEdit = (issue) => setModal({ open: true, issue });
  const closeModal = () => setModal({ open: false, issue: null });

  // Called by IssueForm. If this throws, the form shows the error.
  const handleSave = async (payload) => {
    if (modal.issue) {
      await updateIssue(modal.issue._id, payload);
    } else {
      await createIssue(payload);
      setPage(1);
    }
    closeModal();
    reload();
  };

  const handleDelete = async (issue) => {
    if (!window.confirm(`Delete "${issue.title}"? This cannot be undone.`)) return;

    try {
      await deleteIssue(issue._id);
      // Deleted the last item on this page? Go back one page.
      if (data.issues.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        reload();
      }
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  const hasActiveFilters = Boolean(
    search || filters.status || filters.priority || filters.type
  );

  const newIssueButton = (
    <button onClick={openCreate} className="btn-primary">
      <PlusIcon className="h-4 w-4" />
      New Issue
    </button>
  );

  let content;
  if (loading) {
    content = <Loading message="Loading issues..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={reload} />;
  } else if (data.issues.length === 0) {
    content = hasActiveFilters ? (
      <EmptyState
        title="No matching issues"
        message="Try changing or clearing your filters."
        action={
          <button onClick={handleClear} className="btn-secondary">
            Clear filters
          </button>
        }
      />
    ) : (
      <EmptyState
        title="No issues yet"
        message="Create your first issue to get started."
        action={newIssueButton}
      />
    );
  } else {
    content = (
      <>
        <IssueList
          issues={data.issues}
          currentUserId={user?._id}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          onPageChange={setPage}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Issues</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter and manage every issue in one place.
          </p>
        </div>
        {newIssueButton}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <IssueFilters
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClear}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="space-y-4">{content}</div>

      {modal.open && (
        <Modal title={modal.issue ? 'Edit Issue' : 'New Issue'} onClose={closeModal}>
          <IssueForm
            issue={modal.issue}
            submitLabel={modal.issue ? 'Save changes' : 'Create issue'}
            onSubmit={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}