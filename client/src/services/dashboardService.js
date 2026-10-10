import api from './api';

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data.data; // { total, open, inProgress, resolved, closed, highPriority, recentIssues }
};