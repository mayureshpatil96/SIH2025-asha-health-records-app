const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// const Patient = require('../models/Patient'); // Disabled for demo mode
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/patients
// @desc    Register a new patient
// @access  Private (ASHA workers)
router.post('/', [
  auth,
  upload.single('photo'),
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
    body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number is required'),
    body('address.fullAddress').notEmpty().withMessage('Address is required')
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      alternativePhone,
      aadhaarNumber,
      address,
      medicalHistory,
      emergencyContact,
      registeredBy
    } = req.body;

    // Generate unique health ID
    const healthId = `ASHA-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create patient object (demo mode - no database save)
    const patientData = {
      _id: Date.now().toString(),
      healthId,
      fullName,
      dateOfBirth,
      gender,
      phone,
      alternativePhone,
      aadhaarNumber,
      address: {
        fullAddress: address.fullAddress,
        coordinates: address.coordinates || null
      },
      medicalHistory: medicalHistory || {},
      emergencyContact: emergencyContact || {},
      photo: req.file ? req.file.path : null,
      registeredBy: req.user.id,
      registrationDate: new Date(),
      status: 'active'
    };

    // In demo mode, just return the patient data without saving
    const patient = patientData;

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: {
        _id: patient._id,
        healthId: patient.healthId,
        fullName: patient.fullName,
        phone: patient.phone,
        registrationDate: patient.registrationDate
      }
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ message: 'Server error during patient registration' });
  }
});

// @route   GET /api/patients
// @desc    Get all patients (with pagination and filters)
// @access  Private (ASHA workers)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'active';
    const skip = (page - 1) * limit;

    // Build query
    const query = { status };
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { healthId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { aadhaarNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Demo mode - return mock patients data
    const mockPatients = [
      {
        _id: '1',
        healthId: 'ASHA-001',
        fullName: 'Priya Sharma',
        phone: '+91 9876543210',
        gender: 'female',
        dateOfBirth: '1990-05-15',
        address: { fullAddress: 'Village A, Block B, District C' },
        registrationDate: new Date(),
        status: 'active'
      },
      {
        _id: '2',
        healthId: 'ASHA-002',
        fullName: 'Rajesh Kumar',
        phone: '+91 9876543211',
        gender: 'male',
        dateOfBirth: '1985-03-20',
        address: { fullAddress: 'Village B, Block C, District D' },
        registrationDate: new Date(),
        status: 'active'
      }
    ];

    const patients = mockPatients;
    const total = mockPatients.length;

    res.json({
      success: true,
      patients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPatients: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error while fetching patients' });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private (ASHA workers)
router.get('/:id', auth, async (req, res) => {
  try {
    // Demo mode - return mock patient data
    const mockPatient = {
      _id: req.params.id,
      healthId: 'ASHA-001',
      fullName: 'Priya Sharma',
      phone: '+91 9876543210',
      gender: 'female',
      dateOfBirth: '1990-05-15',
      address: { 
        fullAddress: 'Village A, Block B, District C',
        coordinates: { latitude: 28.6139, longitude: 77.2090 }
      },
      medicalHistory: {
        existingConditions: [],
        familyHistory: [],
        currentMedications: [],
        allergies: [],
        bloodGroup: 'B+'
      },
      registrationDate: new Date(),
      status: 'active'
    };

    res.json({
      success: true,
      patient: mockPatient
    });

  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error while fetching patient' });
  }
});

// @route   GET /api/patients/health-id/:healthId
// @desc    Get patient by Health ID
// @access  Private (ASHA workers)
router.get('/health-id/:healthId', auth, async (req, res) => {
  try {
    // Demo mode - return mock patient data
    const mockPatient = {
      _id: '1',
      healthId: req.params.healthId,
      fullName: 'Priya Sharma',
      phone: '+91 9876543210',
      gender: 'female',
      dateOfBirth: '1990-05-15',
      address: { fullAddress: 'Village A, Block B, District C' },
      registrationDate: new Date(),
      status: 'active'
    };

    res.json({
      success: true,
      patient: mockPatient
    });

  } catch (error) {
    console.error('Get patient by health ID error:', error);
    res.status(500).json({ message: 'Server error while fetching patient' });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient information
// @access  Private (ASHA workers)
router.put('/:id', [
  auth,
  upload.single('photo'),
  [
    body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
    body('phone').optional().isMobilePhone('en-IN').withMessage('Valid Indian phone number is required')
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Demo mode - simulate patient update
    const updateData = req.body;
    
    if (req.file) {
      updateData.photo = req.file.path;
    }

    // Update last modified
    updateData.lastModified = new Date();
    updateData.modifiedBy = req.user.id;

    const updatedPatient = {
      _id: req.params.id,
      ...updateData,
      healthId: 'ASHA-001',
      fullName: updateData.fullName || 'Priya Sharma',
      phone: updateData.phone || '+91 9876543210',
      status: 'active'
    };

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: updatedPatient
    });

  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error while updating patient' });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Soft delete patient (mark as inactive)
// @access  Private (Supervisors only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is supervisor
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Access denied. Supervisor role required.' });
    }

    // Demo mode - simulate patient deletion

    res.json({
      success: true,
      message: 'Patient deactivated successfully'
    });

  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error while deleting patient' });
  }
});

// @route   GET /api/patients/statistics/overview
// @desc    Get patient statistics
// @access  Private (ASHA workers and supervisors)
router.get('/statistics/overview', auth, async (req, res) => {
  try {
    const { district, block, village } = req.query;
    
    // Build location filter
    const locationFilter = {};
    if (district) locationFilter['address.district'] = district;
    if (block) locationFilter['address.block'] = block;
    if (village) locationFilter['address.village'] = village;

    // Demo mode - return mock statistics
    const totalPatients = 150;
    const activePatients = 145;
    const newPatientsThisMonth = 12;
    const patientsByGender = [
      { _id: 'female', count: 85 },
      { _id: 'male', count: 65 }
    ];
    const patientsByAgeGroup = [
      { _id: '0-5', count: 25 },
      { _id: '6-18', count: 30 },
      { _id: '19-45', count: 60 },
      { _id: '46-60', count: 25 },
      { _id: '60+', count: 10 }
    ];

    res.json({
      success: true,
      statistics: {
        totalPatients,
        activePatients,
        newPatientsThisMonth,
        patientsByGender: patientsByGender.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        patientsByAgeGroup: patientsByAgeGroup.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get patient statistics error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   GET /api/patients/export/csv
// @desc    Export patients data as CSV
// @access  Private (Supervisors only)
router.get('/export/csv', auth, async (req, res) => {
  try {
    // Check if user is supervisor
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ message: 'Access denied. Supervisor role required.' });
    }

    const { district, block, village } = req.query;
    
    // Build location filter
    const locationFilter = {};
    if (district) locationFilter['address.district'] = district;
    if (block) locationFilter['address.block'] = block;
    if (village) locationFilter['address.village'] = village;

    // Demo mode - return mock CSV data
    const csvHeader = 'Health ID,Full Name,Date of Birth,Gender,Phone,Address,Registration Date\n';
    const csvData = `ASHA-001,Priya Sharma,1990-05-15,female,+91 9876543210,"Village A, Block B, District C",${new Date().toISOString()}
ASHA-002,Rajesh Kumar,1985-03-20,male,+91 9876543211,"Village B, Block C, District D",${new Date().toISOString()}`;

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="patients_export.csv"');
    res.send(csv);

  } catch (error) {
    console.error('Export patients error:', error);
    res.status(500).json({ message: 'Server error while exporting patients' });
  }
});

module.exports = router;
