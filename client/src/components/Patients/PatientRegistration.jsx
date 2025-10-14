import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  UserIcon, 
  MapPinIcon, 
  PhoneIcon, 
  CalendarIcon,
  CameraIcon,
  MicrophoneIcon,
  QrCodeIcon,
  DocumentTextIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useVoice } from '../../contexts/VoiceContext';
import { useOffline } from '../../contexts/OfflineContext';
import { patientAPI } from '../../services/api';
import QRCodeGenerator from '../QR/QRCodeGenerator';
import VoiceInput from '../Voice/VoiceInput';
import PhotoCapture from '../Camera/PhotoCapture';
import GPSLocation from '../Location/GPSLocation';

const PatientRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  const { startListening, stopListening, transcript, isListening } = useVoice();
  const { isOnline, syncPendingData } = useOffline();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const watchedFields = watch();

  const registerPatientMutation = useMutation(patientAPI.registerPatient, {
    onSuccess: (data) => {
      toast.success('Patient registered successfully!');
      queryClient.invalidateQueries('patients');
      navigate(`/patients/${data.patient._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to register patient');
    }
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: UserIcon },
    { id: 2, title: 'Contact Details', icon: PhoneIcon },
    { id: 3, title: 'Medical History', icon: HeartIcon },
    { id: 4, title: 'Photo & Location', icon: CameraIcon },
    { id: 5, title: 'Review & Submit', icon: ShieldCheckIcon }
  ];

  const handleVoiceInput = (fieldName) => {
    if (isListening) {
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
    setValue('address.coordinates', location);
  };

  const handlePhotoCapture = (photo) => {
    setCapturedPhoto(photo);
    setValue('photo', photo);
  };

  const generateQRCode = () => {
    const patientData = {
      id: `ASHA-${Date.now()}`,
      name: watchedFields.fullName,
      phone: watchedFields.phone,
      registrationDate: new Date().toISOString()
    };
    setQrCodeData(patientData);
  };

  const onSubmit = async (data) => {
    const patientData = {
      ...data,
      photo: capturedPhoto,
      location: currentLocation,
      qrCode: qrCodeData,
      registeredBy: 'current-user-id', // Get from auth context
      registrationDate: new Date().toISOString()
    };

    if (!isOnline) {
      // Store in offline storage
      await syncPendingData('patients', patientData);
      toast.success('Patient data saved offline. Will sync when online.');
      navigate('/patients');
      return;
    }

    registerPatientMutation.mutate(patientData);
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

  useEffect(() => {
    if (transcript && isVoiceActive) {
      // Auto-fill the current active field
      const activeElement = document.activeElement;
      if (activeElement && activeElement.name) {
        setValue(activeElement.name, transcript);
      }
    }
  }, [transcript, isVoiceActive, setValue]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Patient Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Register a new patient with comprehensive health profile
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter patient's full name"
                    />
                    <button
                      type="button"
                      onClick={() => handleVoiceInput('fullName')}
                      className={`absolute right-3 top-3 p-2 rounded-full ${
                        isVoiceActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      } hover:bg-gray-200`}
                    >
                      <MicrophoneIcon className="w-5 h-5" />
                    </button>
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    {...register('aadhaarNumber')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="12-digit Aadhaar number"
                    maxLength="12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="+91 9876543210"
                    />
                    <button
                      type="button"
                      onClick={() => handleVoiceInput('phone')}
                      className={`absolute right-3 top-3 p-2 rounded-full ${
                        isVoiceActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      } hover:bg-gray-200`}
                    >
                      <MicrophoneIcon className="w-5 h-5" />
                    </button>
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alternative Phone
                  </label>
                  <input
                    type="tel"
                    {...register('alternativePhone')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Alternative contact number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address.fullAddress', { required: 'Address is required' })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Complete address with landmark"
                  />
                  {errors.address?.fullAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.fullAddress.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <GPSLocation onLocationCapture={handleLocationCapture} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical History */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Medical History
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Existing Medical Conditions
                  </label>
                  <textarea
                    {...register('medicalHistory.existingConditions')}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="List any existing medical conditions, allergies, or chronic diseases"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Family Medical History
                  </label>
                  <textarea
                    {...register('medicalHistory.familyHistory')}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Any hereditary diseases or family medical history"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    {...register('medicalHistory.currentMedications')}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="List current medications and dosages"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Group
                    </label>
                    <select
                      {...register('medicalHistory.bloodGroup')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      {...register('emergencyContact.name')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Emergency contact person name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photo & Location */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Photo & Location Verification
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Patient Photo
                  </h3>
                  <PhotoCapture onCapture={handlePhotoCapture} capturedPhoto={capturedPhoto} />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Location Verification
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
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Review & Submit
              </h2>
              
              <div className="space-y-6">
                {/* Basic Info Review */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{watchedFields.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">DOB:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{watchedFields.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{watchedFields.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{watchedFields.phone}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Generation */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Health ID QR Code</h3>
                  <button
                    type="button"
                    onClick={generateQRCode}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors mb-4"
                  >
                    Generate QR Code
                  </button>
                  
                  {qrCodeData && (
                    <div className="flex items-center space-x-4">
                      <QRCodeGenerator data={qrCodeData} size={120} />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Health ID: {qrCodeData.id}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          This QR code will be used for quick patient identification
                        </p>
                      </div>
                    </div>
                  )}
                </div>

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
                          ? 'Data will be saved to server immediately' 
                          : 'Data will be saved locally and synced when online'
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
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={registerPatientMutation.isLoading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerPatientMutation.isLoading ? 'Registering...' : 'Register Patient'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
