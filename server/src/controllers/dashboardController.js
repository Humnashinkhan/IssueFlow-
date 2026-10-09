import { getDashboardStats } from '../services/dashboardService.js';

// GET /api/dashboard/stats
export const getStats = async (req, res) => {
  const stats = await getDashboardStats();

  res.status(200).json({ success: true, data: stats });
};