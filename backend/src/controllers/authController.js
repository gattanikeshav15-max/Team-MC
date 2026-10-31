import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'silicon_sentinel_defense_grade_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, team } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'Lead Reliability Engineer',
        team: team || 'Team MC — SVNIT Nexus',
      });

      const token = generateToken({ id: user._id, email: user.email, name: user.name });

      return res.status(201).json({
        success: true,
        message: 'Engineer account created successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team },
      });
    }

    // Demo in-memory mode
    const user = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role || 'Lead Reliability Engineer',
      team: team || 'Team MC — SVNIT Nexus',
      clearanceLevel: 'Level 3 Clearance',
    };
    inMemoryStore.users.push(user);
    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return res.status(201).json({
      success: true,
      message: 'Engineer account created (Demo Mode)',
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid engineer email or security credentials' });
      }

      const token = generateToken({ id: user._id, email: user.email, name: user.name });

      return res.status(200).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team },
      });
    }

    // Demo fallback: default engineer auto-login
    const token = generateToken({ id: 'usr-001', email, name: 'Keshav Gattani' });
    return res.status(200).json({
      success: true,
      message: 'Demo Authentication Successful',
      token,
      user: {
        id: 'usr-001',
        name: 'Keshav Gattani',
        email: email || 'keshav.gattani@svnit.ac.in',
        role: 'Lead Reliability & Avionics Engineer',
        team: 'Team MC — SVNIT Nexus',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

