const express = require('express');
const router = express.Router();

// @route   GET /api/incentives
// @desc    Get incentives data
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Mock incentives data
    const incentives = [
      {
        id: '1',
        ashaWorker: 'ASHA Worker 1',
        month: 'October 2024',
        totalAmount: 2500,
        status: 'approved',
        breakdown: {
          immunization: 800,
          anc: 600,
          pnc: 400,
          illness: 700
        }
      }
    ];
    
    res.json({
      success: true,
      incentives
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
