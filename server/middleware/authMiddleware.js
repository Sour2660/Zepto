import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('❌ Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  // No token at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
