import Issue from '../models/Issue.js';
import { validateIssue } from '../utils/validators.js';

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
const CREATOR_FIELDS = 'name email';

const sendError = (res, status, message, errors) =>
  res.status(status).json({ success: false, message, ...(errors && { errors }) });

// Returns the issue, or sends an error response and returns null
const findIssueOr404 = async (req, res) => {
  if (!OBJECT_ID_REGEX.test(req.params.id)) {
    sendError(res, 400, 'Invalid issue id');
    return null;
  }
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    sendError(res, 404, 'Issue not found');
    return null;
  }
  return issue;
};

const isCreator = (issue, user) => issue.createdBy.equals(user._id);

// POST /api/issues
export const createIssue = async (req, res) => {
  const { errors, data } = validateIssue(req.body ?? {});
  if (Object.keys(errors).length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }

  const issue = await Issue.create({ ...data, createdBy: req.user._id });
  await issue.populate('createdBy', CREATOR_FIELDS);

  res.status(201).json({
    success: true,
    message: 'Issue created',
    data: { issue },
  });
};

// GET /api/issues  (filters and pagination are added in Step 5)
export const getIssues = async (req, res) => {
  const issues = await Issue.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', CREATOR_FIELDS);

  res.status(200).json({ success: true, data: { issues } });
};

// GET /api/issues/:id
export const getIssue = async (req, res) => {
  const issue = await findIssueOr404(req, res);
  if (!issue) return;

  await issue.populate('createdBy', CREATOR_FIELDS);
  res.status(200).json({ success: true, data: { issue } });
};

// PUT /api/issues/:id
export const updateIssue = async (req, res) => {
  const issue = await findIssueOr404(req, res);
  if (!issue) return;

  if (!isCreator(issue, req.user)) {
    return sendError(res, 403, 'You can only edit your own issues');
  }

  const { errors, data } = validateIssue(req.body ?? {}, { partial: true });
  if (Object.keys(errors).length > 0) {
    return sendError(res, 400, 'Validation failed', errors);
  }
  if (Object.keys(data).length === 0) {
    return sendError(res, 400, 'No valid fields to update');
  }

  Object.assign(issue, data);
  await issue.save();
  await issue.populate('createdBy', CREATOR_FIELDS);

  res.status(200).json({
    success: true,
    message: 'Issue updated',
    data: { issue },
  });
};

// DELETE /api/issues/:id
export const deleteIssue = async (req, res) => {
  const issue = await findIssueOr404(req, res);
  if (!issue) return;

  if (!isCreator(issue, req.user)) {
    return sendError(res, 403, 'You can only delete your own issues');
  }

  await issue.deleteOne();

  res.status(200).json({ success: true, message: 'Issue deleted' });
};