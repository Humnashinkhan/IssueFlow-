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