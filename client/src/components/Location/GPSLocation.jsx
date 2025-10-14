import React, { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const GPSLocation = ({ onLocationCapture }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        
        setLocation(locationData);
        onLocationCapture?.(locationData);
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please check your browser settings.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Current Location
        </h3>
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MapPinIcon className="w-4 h-4" />
          <span>{loading ? 'Getting Location...' : 'Get Location'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {location && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <MapPinIcon className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Location captured successfully
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                Accuracy: ±{Math.round(location.accuracy)}m
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Location access is required for accurate patient tracking</p>
        <p>• Your location data is secure and only used for health records</p>
        <p>• You can update location anytime during visit logging</p>
      </div>
    </div>
  );
};

export default GPSLocation;
