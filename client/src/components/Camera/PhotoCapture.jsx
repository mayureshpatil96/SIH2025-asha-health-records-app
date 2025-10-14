import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PhotoCapture = ({ onCapture, capturedPhoto }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture?.(photoData);
    stopCamera();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Patient Photo
        </h3>
        {!isCapturing && !capturedPhoto && (
          <button
            onClick={startCamera}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <CameraIcon className="w-4 h-4" />
            <span>Take Photo</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="relative">
        {isCapturing ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CameraIcon className="w-5 h-5" />
                <span>Capture Photo</span>
              </button>
              
              <button
                onClick={stopCamera}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : capturedPhoto ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={capturedPhoto}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => onCapture?.(null)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Remove Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Click "Take Photo" to capture patient photo
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Patient photos help with identification and record keeping</p>
        <p>• Photos are securely stored and only accessible to authorized personnel</p>
        <p>• You can retake photos if needed</p>
      </div>
    </div>
  );
};

export default PhotoCapture;
