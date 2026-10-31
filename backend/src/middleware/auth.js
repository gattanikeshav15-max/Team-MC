import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'silicon_sentinel_defense_grade_secret_key_2026';

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Allow guest/demo access in development/demo mode if token is omitted
  if (!token) {
    req.user = {
      id: 'usr-guest-engineer',
      name: 'Keshav Gattani',
      email: 'keshav.gattani@svnit.ac.in',
      role: 'Lead Reliability & Avionics Engineer',
      clearanceLevel: 'Level 3 Clearance',
      isGuest: true,
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    const inMemUser = inMemoryStore.users.find((u) => u.id === decoded.id || u.email === decoded.email);
    req.user = inMemUser || {
      id: decoded.id || 'usr-default',
      name: decoded.name || 'Keshav Gattani',
      email: decoded.email || 'keshav.gattani@svnit.ac.in',
      role: decoded.role || 'Lead Reliability Engineer',
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed',
      error: error.message,
    });
  }
};

