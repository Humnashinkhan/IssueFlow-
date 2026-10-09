import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const unauthorized = (res, message) =>
  res.status(401).json({ success: false, message });

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Not authorized, no token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return unauthorized(res, 'Not authorized, token is invalid or expired');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return unauthorized(res, 'Not authorized, user no longer exists');
  }

  req.user = user;
  next();
};