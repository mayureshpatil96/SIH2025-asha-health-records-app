const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  // Unique Health ID
  healthId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  aadhaarNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    validate: {
      validator: function(v) {
        return !v || /^\d{12}$/.test(v);
      },
      message: 'Aadhaar number must be 12 digits'
    }
  },

  // Contact Information
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(\+91|91)?[6-9]\d{9}$/.test(v);
      },
      message: 'Invalid Indian phone number'
    }
  },
  alternativePhone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(\+91|91)?[6-9]\d{9}$/.test(v);
      },
      message: 'Invalid Indian phone number'
    }
  },

  // Address Information
  address: {
    fullAddress: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    district: {
      type: String,
      required: true
    },
    block: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^\d{6}$/.test(v);
        },
        message: 'Pincode must be 6 digits'
      }
    }
  },

  // Medical History
  medicalHistory: {
    existingConditions: [{
      condition: String,
      diagnosedDate: Date,
      treatment: String,
      status: {
        type: String,
        enum: ['active', 'resolved', 'chronic']
      }
    }],
    familyHistory: [{
      relation: String,
      condition: String,
      notes: String
    }],
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String,
      prescribedDate: Date,
      doctor: String
    }],
    allergies: [{
      allergen: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      },
      reaction: String
    }],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    height: {
      type: Number, // in cm
      min: 50,
      max: 250
    },
    weight: {
      type: Number, // in kg
      min: 1,
      max: 300
    }
  },

  // Emergency Contact
  emergencyContact: {
    name: String,
    relation: String,
    phone: String,
    address: String
  },

  // Pregnancy Information (for female patients)
  pregnancyInfo: {
    isPregnant: {
      type: Boolean,
      default: false
    },
    expectedDeliveryDate: Date,
    pregnancyNumber: Number,
    previousPregnancies: [{
      deliveryDate: Date,
      outcome: {
        type: String,
        enum: ['live_birth', 'still_birth', 'miscarriage', 'abortion']
      },
      birthWeight: Number,
      complications: String
    }],
    highRiskFactors: [String]
  },

  // Immunization Records
  immunizationRecords: [{
    vaccine: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    batchNumber: String,
    administeredBy: String,
    site: String,
    nextDueDate: Date,
    status: {
      type: String,
      enum: ['completed', 'due', 'overdue', 'missed'],
      default: 'completed'
    }
  }],

  // Visit History
  visits: [{
    type: {
      type: String,
      enum: ['antenatal', 'postnatal', 'immunization', 'illness', 'follow_up', 'health_check'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    ashaWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['home', 'health_center', 'hospital'],
        default: 'home'
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    findings: {
      vitalSigns: {
        bloodPressure: String,
        pulse: Number,
        temperature: Number,
        weight: Number
      },
      symptoms: [String],
      diagnosis: String,
      treatment: String,
      medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
      }],
      recommendations: [String],
      nextVisitDate: Date
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'document', 'prescription']
      },
      filename: String,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],

  // Risk Assessment
  riskAssessment: {
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    riskFactors: [String],
    lastAssessmentDate: Date,
    assessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  },

  // QR Code Information
  qrCode: {
    data: String,
    generatedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },

  // Photo
  photo: {
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },

  // Status and Metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased'],
    default: 'active'
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
PatientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for BMI calculation
PatientSchema.virtual('bmi').get(function() {
  if (!this.medicalHistory.height || !this.medicalHistory.weight) return null;
  const heightInMeters = this.medicalHistory.height / 100;
  return (this.medicalHistory.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Indexes for better query performance
PatientSchema.index({ healthId: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ aadhaarNumber: 1 });
PatientSchema.index({ 'address.district': 1, 'address.block': 1, 'address.village': 1 });
PatientSchema.index({ registrationDate: -1 });
PatientSchema.index({ status: 1 });
PatientSchema.index({ registeredBy: 1 });

// Text search index
PatientSchema.index({
  fullName: 'text',
  healthId: 'text',
  phone: 'text'
});

// Pre-save middleware
PatientSchema.pre('save', function(next) {
  this.lastModified = new Date();
  
  // Generate QR code data if not exists
  if (!this.qrCode.data) {
    this.qrCode.data = JSON.stringify({
      healthId: this.healthId,
      name: this.fullName,
      phone: this.phone,
      registrationDate: this.registrationDate
    });
  }
  
  next();
});

// Pre-update middleware
PatientSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastModified: new Date() });
  next();
});

// Static methods
PatientSchema.statics.findByHealthId = function(healthId) {
  return this.findOne({ healthId, status: 'active' });
};

PatientSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone, status: 'active' });
};

PatientSchema.statics.getStatistics = function(filter = {}) {
  return this.aggregate([
    { $match: { ...filter, status: 'active' } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byGender: {
          $push: {
            gender: '$gender'
          }
        },
        byAge: {
          $push: {
            age: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                365 * 24 * 60 * 60 * 1000
              ]
            }
          }
        }
      }
    }
  ]);
};

// Instance methods
PatientSchema.methods.getAgeInMonths = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
};

PatientSchema.methods.isHighRisk = function() {
  return this.riskAssessment.riskLevel === 'high' || this.riskAssessment.riskLevel === 'critical';
};

PatientSchema.methods.getUpcomingVaccines = function() {
  const today = new Date();
  return this.immunizationRecords.filter(record => 
    record.nextDueDate && record.nextDueDate <= today
  );
};

PatientSchema.methods.addVisit = function(visitData) {
  this.visits.push({
    ...visitData,
    date: new Date()
  });
  this.lastModified = new Date();
  return this.save();
};

module.exports = mongoose.model('Patient', PatientSchema);
