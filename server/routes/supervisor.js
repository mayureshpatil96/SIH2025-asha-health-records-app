const express = require('express');
const router = express.Router();

// @route   GET /api/supervisor/dashboard
// @desc    Get supervisor dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    // Mock dashboard data
    const dashboardData = {
      totalAshaWorkers: 25,
      totalPatients: 5000,
      totalVisits: 15000,
      highRiskCases: 45,
      performance: {
        averageVisits: 85,
        compliance: 92,
        satisfaction: 4.2
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
