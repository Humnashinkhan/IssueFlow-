import { Router } from 'express';
import {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').post(createIssue).get(getIssues);
router.route('/:id').get(getIssue).put(updateIssue).delete(deleteIssue);

export default router;