const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware'); // Ya apni middleware file ka sahi path dein
const JWT_SECRET = process.env.JWT_SECRET || 'kabirians_jwt_secret';

// ==========================================
// 1. TEAM HEAD / USER REGISTRATION
// @route POST /api/v1/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, teamName, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Pass plain password directly — User.js pre('save') hook will hash it ONCE
    const user = await User.create({
      name: name.trim(),
      fullName: name.trim(),
      teamName: teamName ? teamName.trim() : '',
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      password: password,
      role: role || 'team_head',
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });
    res.cookie('role', user.role, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        teamName: user.teamName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration.',
    });
  }
});

// ==========================================
// 2. TEAM HEAD / USER LOGIN
// @route POST /api/v1/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Fetch user with password field included
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Use user.matchPassword method from User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });
    res.cookie('role', user.role, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name || user.fullName,
        teamName: user.teamName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login.',
    });
  }
});

// ==========================================
// 3. MASTER ADMIN LOGIN (Untouched & Safe)
// @route POST /api/v1/auth/admin-login
// ==========================================
router.post('/admin-login', async (req, res) => {
  try {
    const { secretKey } = req.body;

    const rawEnvKey =
      process.env.ADMIN_SECRET_KEY ||
      process.env.ADMIN_SECRET ||
      process.env.SECRET_KEY ||
      process.env.ADMIN_KEY ||
      'KABIRIANS_SECURE_2026';

    const cleanEnvKey = String(rawEnvKey).trim().replace(/^["']|["']$/g, '');
    const cleanInputKey = String(secretKey || '').trim().replace(/^["']|["']$/g, '');

    if (!cleanInputKey) {
      return res.status(400).json({
        success: false,
        message: 'Admin Secret Key is required.',
      });
    }

    if (cleanInputKey !== cleanEnvKey) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Invalid Admin Secret Key.',
      });
    }

    const token = jwt.sign(
      { id: 'admin-master', role: 'admin', email: 'admin@eventportal.com' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });
    res.cookie('role', 'admin', {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Master authentication successful!',
      token,
      user: { name: 'Admin', email: 'admin@eventportal.com', role: 'admin' },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
// GET /api/v1/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;