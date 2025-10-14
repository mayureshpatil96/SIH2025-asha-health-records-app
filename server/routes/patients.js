const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
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

    // Create patient object
    const patientData = {
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

    const patient = new Patient(patientData);
    await patient.save();

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

    // Get patients with pagination
    const patients = await Patient.find(query)
      .select('healthId fullName phone gender dateOfBirth address photo registrationDate status')
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Patient.countDocuments(query);

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
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      success: true,
      patient
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
    const patient = await Patient.findOne({ healthId: req.params.healthId });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      success: true,
      patient
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

    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update fields
    const updateData = req.body;
    
    if (req.file) {
      updateData.photo = req.file.path;
    }

    // Update last modified
    updateData.lastModified = new Date();
    updateData.modifiedBy = req.user.id;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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

    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Soft delete - mark as inactive
    patient.status = 'inactive';
    patient.deletedAt = new Date();
    patient.deletedBy = req.user.id;
    
    await patient.save();

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

    const [
      totalPatients,
      activePatients,
      newPatientsThisMonth,
      patientsByGender,
      patientsByAgeGroup
    ] = await Promise.all([
      Patient.countDocuments({ ...locationFilter }),
      Patient.countDocuments({ ...locationFilter, status: 'active' }),
      Patient.countDocuments({
        ...locationFilter,
        registrationDate: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      Patient.aggregate([
        { $match: locationFilter },
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ]),
      Patient.aggregate([
        { $match: locationFilter },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lte: [{ $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] }, 5] }, then: '0-5' },
                  { case: { $lte: [{ $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] }, 18] }, then: '6-18' },
                  { case: { $lte: [{ $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] }, 45] }, then: '19-45' },
                  { case: { $lte: [{ $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] }, 60] }, then: '46-60' }
                ],
                default: '60+'
              }
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

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

    const patients = await Patient.find(locationFilter)
      .select('healthId fullName dateOfBirth gender phone address.fullAddress registrationDate')
      .sort({ registrationDate: -1 });

    // Convert to CSV
    const csvHeader = 'Health ID,Full Name,Date of Birth,Gender,Phone,Address,Registration Date\n';
    const csvData = patients.map(patient => 
      `${patient.healthId},${patient.fullName},${patient.dateOfBirth},${patient.gender},${patient.phone},"${patient.address.fullAddress}",${patient.registrationDate}`
    ).join('\n');

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
