import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchDashboardStats } from '../services/dashboardService';
import { getApiError } from '../utils/errors';
import { formatDate } from '../utils/formatters';
import { StatusBadge, PriorityBadge, TypeBadge } from '../components/Badges';
import DashboardCard from '../components/DashboardCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const CARDS = [
  { key: 'total', label: 'Total Issues', accent: 'text-gray-900' },
  { key: 'open', label: 'Open', accent: 'text-blue-600' },
  { key: 'inProgress', label: 'In Progress', accent: 'text-yellow-600' },
  { key: 'resolved', label: 'Resolved', accent: 'text-green-600' },
  { key: 'closed', label: 'Closed', accent: 'text-gray-500' },
  { key: 'highPriority', label: 'High Priority', accent: 'text-red-600' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchDashboardStats();
        if (!ignore) setStats(result);
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
  }, [reloadKey]);

  let content;
  if (loading) {
    content = <Loading message="Loading dashboard..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  } else {
    content = (
      <>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CARDS.map(({ key, label, accent }) => (
            <DashboardCard key={key} label={label} value={stats[key]} accent={accent} />
          ))}
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent issues</h2>
            <Link to="/issues" className="text-sm font-medium text-indigo-600 hover:underline">
              View all
            </Link>
          </div>

          {stats.recentIssues.length === 0 ? (
            <EmptyState
              title="No issues yet"
              message="Issues you create will show up here."
              action={
                <Link to="/issues" className="font-medium text-indigo-600 hover:underline">
                  Go to issues
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
              {stats.recentIssues.map((issue) => (
                <li key={issue._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {issue.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      by {issue.createdBy?.name ?? 'Unknown'} &middot; {formatDate(issue.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <TypeBadge value={issue.type} />
                    <StatusBadge value={issue.status} />
                    <PriorityBadge value={issue.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {user?.name}.</p>
      </div>
      {content}
    </div>
  );
}