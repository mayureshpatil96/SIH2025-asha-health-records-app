const express = require('express');
const router = express.Router();

// @route   POST /api/visits
// @desc    Log a new visit
// @access  Private
router.post('/', async (req, res) => {
  try {
    const visitData = req.body;
    
    // Mock visit creation
    const visit = {
      id: Date.now().toString(),
      ...visitData,
      createdAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      visit
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/visits
// @desc    Get all visits
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Mock visits data
    const visits = [
      {
        id: '1',
        patient: 'Patient 1',
        type: 'immunization',
        date: new Date(),
        status: 'completed'
      },
      {
        id: '2',
        patient: 'Patient 2',
        type: 'anc',
        date: new Date(),
        status: 'pending'
      }
    ];
    
    res.json({
      success: true,
      visits
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
