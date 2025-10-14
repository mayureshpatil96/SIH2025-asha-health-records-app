import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  HeartIcon, 
  UserGroupIcon, 
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useVoice } from '../../contexts/VoiceContext';
import { useOffline } from '../../contexts/OfflineContext';
import { visitAPI, patientAPI } from '../../services/api';
import GPSLocation from '../Location/GPSLocation';
import PhotoCapture from '../Camera/PhotoCapture';
import VoiceInput from '../Voice/VoiceInput';

const VisitLogging = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visitType, setVisitType] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({});
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const { startListening, stopListening, transcript } = useVoice();
  const { isOnline, syncPendingData } = useOffline();
  const navigate = useNavigate();

  const watchedFields = watch();

  // Pre-fill patient if coming from QR scanner
  const patientId = searchParams.get('patientId');

  const { data: patients } = useQuery('patients', () => patientAPI.getPatients({ limit: 100 }));

  const logVisitMutation = useMutation(visitAPI.logVisit, {
    onSuccess: (data) => {
      toast.success('Visit logged successfully!');
      navigate(`/visits/history`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to log visit');
    }
  });

  const visitTypes = [
    { 
      id: 'antenatal', 
      label: 'Antenatal Care (ANC)', 
      icon: HeartIcon, 
      color: 'pink',
      description: 'Pregnancy checkup and monitoring'
    },
    { 
      id: 'postnatal', 
      label: 'Postnatal Care (PNC)', 
      icon: UserGroupIcon, 
      color: 'blue',
      description: 'Post-delivery care for mother and baby'
    },
    { 
      id: 'immunization', 
      label: 'Immunization', 
      icon: CheckCircleIcon, 
      color: 'green',
      description: 'Vaccination and immunization services'
    },
    { 
      id: 'illness', 
      label: 'Illness Treatment', 
      icon: ExclamationTriangleIcon, 
      color: 'red',
      description: 'Treatment for illnesses and diseases'
    },
    { 
      id: 'follow_up', 
      label: 'Follow-up Visit', 
      icon: CalendarIcon, 
      color: 'yellow',
      description: 'Follow-up for previous treatment'
    },
    { 
      id: 'health_check', 
      label: 'General Health Check', 
      icon: DocumentTextIcon, 
      color: 'purple',
      description: 'Routine health assessment'
    }
  ];

  const steps = [
    { id: 1, title: 'Select Patient', icon: UserGroupIcon },
    { id: 2, title: 'Visit Type', icon: HeartIcon },
    { id: 3, title: 'Vital Signs', icon: DocumentTextIcon },
    { id: 4, title: 'Assessment', icon: ExclamationTriangleIcon },
    { id: 5, title: 'Location & Photos', icon: CameraIcon },
    { id: 6, title: 'Review & Submit', icon: CheckCircleIcon }
  ];

  const handleVoiceInput = (fieldName) => {
    if (isVoiceActive) {
      stopListening();
      setIsVoiceActive(false);
      if (transcript) {
        setValue(fieldName, transcript);
      }
    } else {
      startListening();
      setIsVoiceActive(true);
    }
  };

  const handleLocationCapture = (location) => {
    setCurrentLocation(location);
    setValue('location.coordinates', location);
  };

  const handlePhotoCapture = (photo) => {
    setCapturedPhotos(prev => [...prev, photo]);
  };

  const handleVitalSignChange = (field, value) => {
    setVitalSigns(prev => ({
      ...prev,
      [field]: value
    }));
    setValue(`findings.vitalSigns.${field}`, value);
  };

  const onSubmit = async (data) => {
    const visitData = {
      ...data,
      patient: selectedPatient._id,
      type: visitType,
      ashaWorker: 'current-user-id', // Get from auth context
      location: {
        type: 'home',
        coordinates: currentLocation
      },
      findings: {
        ...data.findings,
        vitalSigns,
        attachments: capturedPhotos
      },
      date: new Date().toISOString()
    };

    if (!isOnline) {
      await syncPendingData('visits', visitData);
      toast.success('Visit data saved offline. Will sync when online.');
      navigate('/dashboard');
      return;
    }

    logVisitMutation.mutate(visitData);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-select patient if coming from QR scanner
  useEffect(() => {
    if (patientId && patients?.data?.patients) {
      const patient = patients.data.patients.find(p => p._id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        setValue('patient', patient._id);
      }
    }
  }, [patientId, patients, setValue]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Log Health Visit
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record patient visit details with comprehensive assessment
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center min-w-0">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0
                  ${currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 min-w-0">
                  <p className={`text-sm font-medium whitespace-nowrap ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 flex-shrink-0 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Select Patient */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Select Patient
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Patient
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, health ID, or phone number..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {selectedPatient && (
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-primary-900 dark:text-primary-100">
                          {selectedPatient.fullName}
                        </h3>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          Health ID: {selectedPatient.healthId} • Phone: {selectedPatient.phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(null)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {patients?.data?.patients?.map((patient) => (
                    <button
                      key={patient._id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setValue('patient', patient._id);
                      }}
                      className={`p-4 text-left border rounded-lg transition-all ${
                        selectedPatient?._id === patient._id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {patient.fullName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {patient.healthId}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Visit Type */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Select Visit Type
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setVisitType(type.id)}
                    className={`p-6 text-left border-2 rounded-lg transition-all ${
                      visitType === type.id
                        ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <type.icon className={`w-8 h-8 ${
                        visitType === type.id ? `text-${type.color}-600` : 'text-gray-400'
                      }`} />
                      <div>
                        <h3 className={`font-medium mb-2 ${
                          visitType === type.id 
                            ? `text-${type.color}-900 dark:text-${type.color}-100` 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {type.label}
                        </h3>
                        <p className={`text-sm ${
                          visitType === type.id 
                            ? `text-${type.color}-700 dark:text-${type.color}-300` 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Vital Signs */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Vital Signs Assessment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pulse Rate (BPM)
                  </label>
                  <input
                    type="number"
                    placeholder="72"
                    onChange={(e) => handleVitalSignChange('pulse', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    onChange={(e) => handleVitalSignChange('temperature', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="65.5"
                    onChange={(e) => handleVitalSignChange('weight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="165"
                    onChange={(e) => handleVitalSignChange('height', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Respiratory Rate
                  </label>
                  <input
                    type="number"
                    placeholder="16"
                    onChange={(e) => handleVitalSignChange('respiratoryRate', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Assessment */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Clinical Assessment
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    {...register('findings.symptoms')}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe any symptoms or complaints..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Clinical Findings
                  </label>
                  <textarea
                    {...register('findings.clinicalFindings')}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Record clinical observations and examination findings..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    {...register('findings.diagnosis')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter diagnosis or assessment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Treatment Provided
                  </label>
                  <textarea
                    {...register('findings.treatment')}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe treatment provided, medications given, or referrals made..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recommendations
                  </label>
                  <textarea
                    {...register('findings.recommendations')}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Provide recommendations for follow-up care..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Next Visit Date
                  </label>
                  <input
                    type="date"
                    {...register('findings.nextVisitDate')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Location & Photos */}
          {currentStep === 5 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Location & Documentation
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Visit Location
                  </h3>
                  <GPSLocation onLocationCapture={handleLocationCapture} />
                  
                  {currentLocation && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        ✅ Location captured successfully
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        Lat: {currentLocation.latitude}, Lng: {currentLocation.longitude}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Photos & Documentation
                  </h3>
                  <PhotoCapture onCapture={handlePhotoCapture} />
                  
                  {capturedPhotos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Captured photos: {capturedPhotos.length}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {capturedPhotos.map((photo, index) => (
                          <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img 
                              src={photo} 
                              alt={`Visit photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Review & Submit Visit
              </h2>
              
              <div className="space-y-6">
                {/* Visit Summary */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Visit Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Patient:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{selectedPatient?.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Visit Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {visitTypes.find(t => t.id === visitType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Location:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {currentLocation ? 'Captured' : 'Not captured'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Summary */}
                {Object.keys(vitalSigns).length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Vital Signs</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(vitalSigns).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-500 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission Status */}
                <div className={`p-4 rounded-lg ${
                  isOnline 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      isOnline ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        isOnline ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {isOnline ? 'Online Mode' : 'Offline Mode'}
                      </p>
                      <p className={`text-xs ${
                        isOnline ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {isOnline 
                          ? 'Visit will be saved to server immediately' 
                          : 'Visit will be saved locally and synced when online'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !selectedPatient) ||
                  (currentStep === 2 && !visitType)
                }
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={logVisitMutation.isLoading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logVisitMutation.isLoading ? 'Logging Visit...' : 'Log Visit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitLogging;
