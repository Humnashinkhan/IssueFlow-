import Issue from '../models/Issue.js';
import { ISSUE_STATUSES } from '../utils/constants.js';

const RECENT_LIMIT = 5;

export const getDashboardStats = async () => {
  const [facetResult, recentIssues] = await Promise.all([
    Issue.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          highPriority: [{ $match: { priority: 'High' } }, { $count: 'count' }],
        },
      },
    ]),
    Issue.find()
      .sort({ createdAt: -1, _id: -1 })
      .limit(RECENT_LIMIT)
      .populate('createdBy', 'name email'),
  ]);

  const { byStatus, highPriority } = facetResult[0];

  // Start every status at 0 so statuses with no issues still appear
  const statusCounts = Object.fromEntries(ISSUE_STATUSES.map((s) => [s, 0]));
  for (const { _id, count } of byStatus) {
    statusCounts[_id] = count;
  }

  const total = Object.values(statusCounts).reduce((sum, n) => sum + n, 0);

  return {
    total,
    open: statusCounts['Open'],
    inProgress: statusCounts['In Progress'],
    resolved: statusCounts['Resolved'],
    closed: statusCounts['Closed'],
    highPriority: highPriority[0]?.count ?? 0,
    recentIssues,
  };
};