const express = require('express');
const router = express.Router();

// @route   POST /api/alerts/emergency
// @desc    Send emergency alert
// @access  Private
router.post('/emergency', async (req, res) => {
  try {
    const alertData = req.body;
    
    // Mock emergency alert
    const alert = {
      id: Date.now().toString(),
      ...alertData,
      status: 'sent',
      timestamp: new Date()
    };
    
    res.status(201).json({
      success: true,
      alert,
      message: 'Emergency alert sent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/alerts/emergency
// @desc    Get emergency alerts
// @access  Private
router.get('/emergency', async (req, res) => {
  try {
    // Mock alerts data
    const alerts = [
      {
        id: '1',
        type: 'maternal-emergency',
        patientInfo: 'Emergency case in Block A',
        location: { latitude: 28.6139, longitude: 77.2090 },
        status: 'active',
        timestamp: new Date()
      }
    ];
    
    res.json({
      success: true,
      alerts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
