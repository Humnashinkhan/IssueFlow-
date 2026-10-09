import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validateRegister, validateLogin } from '../utils/validators.js';

const validationFailed = (res, errors) =>
  res.status(400).json({ success: false, message: 'Validation failed', errors });

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  const errors = validateRegister({ name, email, password });
  if (Object.keys(errors).length > 0) {
    return validationFailed(res, errors);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email is already registered',
      errors: { email: 'Email is already registered' },
    });
  }

  const user = await User.create({ name, email: normalizedEmail, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user, token },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length > 0) {
    return validationFailed(res, errors);
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    '+password'
  );

  const isMatch = user && (await user.comparePassword(password));
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, token },
  });
};