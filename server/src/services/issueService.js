import Issue from '../models/Issue.js';
import {
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
} from '../utils/constants.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const isString = (value) => typeof value === 'string';

// Escape regex special characters so user input is treated as plain text
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Turns req.query into a validated Mongo filter, sort direction, and paging values
export const buildListQuery = (query = {}) => {
  const errors = {};
  const filter = {};

  const enumFilters = [
    ['status', ISSUE_STATUSES],
    ['priority', ISSUE_PRIORITIES],
    ['type', ISSUE_TYPES],
  ];

  for (const [field, allowed] of enumFilters) {
    const value = query[field];
    if (value === undefined || value === '') continue;
    if (!isString(value) || !allowed.includes(value)) {
      errors[field] = `${field} must be one of: ${allowed.join(', ')}`;
    } else {
      filter[field] = value;
    }
  }

  const { search } = query;
  if (search !== undefined && search !== '') {
    if (!isString(search) || search.trim().length > 100) {
      errors.search = 'Search must be text of at most 100 characters';
    } else if (search.trim()) {
      filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }
  }

  let sortOrder = -1;
  if (query.sort !== undefined && query.sort !== '') {
    if (query.sort === 'newest') sortOrder = -1;
    else if (query.sort === 'oldest') sortOrder = 1;
    else errors.sort = 'sort must be one of: newest, oldest';
  }

  let page = 1;
  if (query.page !== undefined && query.page !== '') {
    page = Number(query.page);
    if (!Number.isInteger(page) || page < 1) {
      errors.page = 'page must be a positive whole number';
    }
  }

  let limit = DEFAULT_LIMIT;
  if (query.limit !== undefined && query.limit !== '') {
    limit = Number(query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      errors.limit = `limit must be a whole number between 1 and ${MAX_LIMIT}`;
    }
  }

  return { errors, filter, sortOrder, page, limit };
};

// Runs the query and the total count together
export const getIssuesPage = async ({ filter, sortOrder, page, limit }) => {
  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .sort({ createdAt: sortOrder, _id: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email'),
    Issue.countDocuments(filter),
  ]);

  return { issues, total, totalPages: Math.ceil(total / limit) };
};