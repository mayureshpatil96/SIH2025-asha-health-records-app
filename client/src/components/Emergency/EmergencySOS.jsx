import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { 
  ExclamationTriangleIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  BellIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { alertAPI } from '../../services/api';
import GPSLocation from '../Location/GPSLocation';

const EmergencySOS = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [emergencyHistory, setEmergencyHistory] = useState([]);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(false);

  const sendEmergencyAlertMutation = useMutation(alertAPI.sendEmergencyAlert, {
    onSuccess: (data) => {
      toast.success('Emergency alert sent successfully!');
      setIsEmergencyActive(false);
      setCountdown(0);
      // Add to history
      setEmergencyHistory(prev => [{
        id: Date.now(),
        type: emergencyType,
        patientInfo,
        location: currentLocation,
        timestamp: new Date(),
        status: 'sent'
      }, ...prev]);
    },
    onError: (error) => {
      toast.error('Failed to send emergency alert. Please try again.');
      setIsEmergencyActive(false);
      setCountdown(0);
    }
  });

  const emergencyTypes = [
    { id: 'maternal-emergency', label: 'Maternal Emergency', icon: HeartIcon, color: 'red' },
    { id: 'child-emergency', label: 'Child Emergency', icon: UserGroupIcon, color: 'orange' },
    { id: 'accident', label: 'Accident/Injury', icon: ExclamationTriangleIcon, color: 'yellow' },
    { id: 'cardiac', label: 'Cardiac Emergency', icon: HeartIcon, color: 'red' },
    { id: 'respiratory', label: 'Respiratory Distress', icon: HeartIcon, color: 'purple' },
    { id: 'other', label: 'Other Emergency', icon: ExclamationTriangleIcon, color: 'gray' }
  ];

  const handleEmergencyActivation = () => {
    if (!emergencyType) {
      toast.error('Please select emergency type first');
      return;
    }
    
    setIsEmergencyActive(true);
    setCountdown(5);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-send emergency alert after countdown
          handleSendEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendEmergency = () => {
    if (!currentLocation) {
      toast.error('Location is required for emergency alerts');
      return;
    }

    const emergencyData = {
      type: emergencyType,
      patientInfo,
      location: currentLocation,
      timestamp: new Date().toISOString(),
      ashaWorkerId: 'current-user-id', // Get from auth context
      priority: 'high'
    };

    sendEmergencyAlertMutation.mutate(emergencyData);
  };

  const handleCancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(0);
    toast.success('Emergency alert cancelled');
  };

  const handleLocationCapture = (location) => {
    setCurrentLocation(location);
    setIsLocationPermissionGranted(true);
  };

  const getEmergencyTypeInfo = (typeId) => {
    return emergencyTypes.find(type => type.id === typeId);
  };

  const getEmergencyColor = (typeId) => {
    const type = getEmergencyTypeInfo(typeId);
    return type ? type.color : 'gray';
  };

  useEffect(() => {
    // Request location permission on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setIsLocationPermissionGranted(true),
        () => setIsLocationPermissionGranted(false)
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Emergency SOS
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Send instant emergency alerts to nearest health facilities
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isEmergencyActive ? 'bg-red-500 animate-pulse' : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              <BellIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Emergency Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Select Emergency Type
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setEmergencyType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      emergencyType === type.id
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                      emergencyType === type.id ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      emergencyType === type.id ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Patient Information
              </h2>
              <textarea
                value={patientInfo}
                onChange={(e) => setPatientInfo(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe the emergency situation, patient condition, and any immediate actions taken..."
              />
            </div>

            {/* Location Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Current Location
              </h2>
              <GPSLocation onLocationCapture={handleLocationCapture} />
              
              {currentLocation && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Location captured successfully
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500">
                        {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              {!isEmergencyActive ? (
                <div className="text-center">
                  <button
                    onClick={handleEmergencyActivation}
                    disabled={!emergencyType || !currentLocation}
                    className={`px-8 py-4 rounded-lg font-semibold text-white transition-all ${
                      emergencyType && currentLocation
                        ? 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ExclamationTriangleIcon className="w-6 h-6 inline mr-2" />
                    Activate Emergency Alert
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Alert will be sent automatically after 5 seconds
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-red-600 animate-pulse">
                    {countdown}
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Emergency alert will be sent in {countdown} seconds
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleSendEmergency}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Send Now
                    </button>
                    <button
                      onClick={handleCancelEmergency}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Contacts
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        District Hospital
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Emergency Line
                      </p>
                    </div>
                  </div>
                  <a href="tel:108" className="text-primary-600 hover:text-primary-700 font-medium">
                    108
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Ambulance
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Medical Emergency
                      </p>
                    </div>
                  </div>
                  <a href="tel:102" className="text-primary-600 hover:text-primary-700 font-medium">
                    102
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Police
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Emergency
                      </p>
                    </div>
                  </div>
                  <a href="tel:100" className="text-primary-600 hover:text-primary-700 font-medium">
                    100
                  </a>
                </div>
              </div>
            </div>

            {/* Emergency History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {emergencyHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent emergency alerts
                  </p>
                ) : (
                  emergencyHistory.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getEmergencyColor(alert.type)}-100 text-${getEmergencyColor(alert.type)}-800`}>
                          {getEmergencyTypeInfo(alert.type)?.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {alert.patientInfo.substring(0, 50)}...
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  📞 Call Nearest Health Center
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🚑 Request Ambulance
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  📍 Share Location
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  📋 Emergency Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
