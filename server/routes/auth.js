const express = require('express');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock authentication for demo
    if (email === 'asha@demo.com' && password === 'password') {
      const token = 'mock-jwt-token-' + Date.now();
      res.json({
        success: true,
        token,
        user: {
          id: '1',
          name: 'ASHA Worker Demo',
          email: 'asha@demo.com',
          role: 'asha_worker'
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Mock registration for demo
    const token = 'mock-jwt-token-' + Date.now();
    res.status(201).json({
      success: true,
      token,
      user: {
        id: Date.now().toString(),
        name,
        email,
        role: role || 'asha_worker'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
