import {
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
} from './constants.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const isString = (value) => typeof value === 'string';

export const validateRegister = ({ name, email, password }) => {
  const errors = {};

  if (!isString(name) || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters';
  }

  if (!isString(email) || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email';
  }

  if (!isString(password) || password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!isString(email) || !email.trim()) {
    errors.email = 'Email is required';
  }

  if (!isString(password) || !password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateIssue = (body = {}, { partial = false } = {}) => {
  const errors = {};
  const data = {};

  const shouldCheck = (field) => !partial || body[field] !== undefined;

  if (shouldCheck('title')) {
    if (!isString(body.title) || !body.title.trim()) {
      errors.title = 'Title is required';
    } else if (body.title.trim().length > 120) {
      errors.title = 'Title cannot exceed 120 characters';
    } else {
      data.title = body.title.trim();
    }
  }

  if (shouldCheck('description')) {
    if (!isString(body.description) || !body.description.trim()) {
      errors.description = 'Description is required';
    } else if (body.description.trim().length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
    } else {
      data.description = body.description.trim();
    }
  }

  const enumFields = [
    ['status', ISSUE_STATUSES],
    ['priority', ISSUE_PRIORITIES],
    ['type', ISSUE_TYPES],
  ];

  for (const [field, allowed] of enumFields) {
    if (body[field] === undefined) continue;
    if (!allowed.includes(body[field])) {
      errors[field] = `${field} must be one of: ${allowed.join(', ')}`;
    } else {
      data[field] = body[field];
    }
  }

  return { errors, data };
};