import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { 
  QrCodeIcon, 
  CameraIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { patientAPI } from '../../services/api';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch patient data when QR code is scanned
  const { data: patientData, refetch: refetchPatient } = useQuery(
    ['patient', scannedData?.id],
    () => patientAPI.getPatientById(scannedData?.id),
    {
      enabled: !!scannedData?.id,
      onSuccess: (data) => {
        toast.success('Patient data loaded successfully!');
        setScanHistory(prev => [{
          id: Date.now(),
          patientId: scannedData.id,
          patientName: data.name,
          scanTime: new Date(),
          success: true
        }, ...prev.slice(0, 9)]); // Keep only last 10 scans
      },
      onError: (error) => {
        toast.error('Failed to load patient data');
        setScanHistory(prev => [{
          id: Date.now(),
          patientId: scannedData?.id || 'Unknown',
          patientName: 'Unknown',
          scanTime: new Date(),
          success: false
        }, ...prev.slice(0, 9)]);
      }
    }
  );

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      setError(null);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (err) {
      console.error('Camera permission error:', err);
      setHasPermission(false);
      setError('Camera access denied. Please allow camera permission to scan QR codes.');
      return null;
    }
  };

  const startScanning = async () => {
    if (hasPermission === null) {
      const stream = await requestCameraPermission();
      if (!stream) return;
    }

    setIsScanning(true);
    setError(null);

    // Start QR code detection
    detectQRCode();
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Simple QR code detection (in a real app, you'd use a library like jsQR)
        // For demo purposes, we'll simulate QR detection
        if (Math.random() < 0.01) { // 1% chance per frame for demo
          const mockQRData = {
            id: `ASHA-${Date.now()}`,
            name: 'Sample Patient',
            phone: '+91 9876543210',
            registrationDate: new Date().toISOString()
          };
          
          handleQRCodeDetected(mockQRData);
          return;
        }
      }

      if (isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const handleQRCodeDetected = (data) => {
    setScannedData(data);
    setIsScanning(false);
    stopScanning();
  };

  const handleManualInput = () => {
    const manualId = prompt('Enter Patient Health ID:');
    if (manualId) {
      const mockData = {
        id: manualId,
        name: 'Manual Entry',
        phone: 'N/A',
        registrationDate: new Date().toISOString()
      };
      handleQRCodeDetected(mockData);
    }
  };

  const clearScan = () => {
    setScannedData(null);
    setError(null);
  };

  useEffect(() => {
    // Load scan history from localStorage
    const savedHistory = localStorage.getItem('qr-scan-history');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // Save scan history to localStorage
    localStorage.setItem('qr-scan-history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                QR Code Scanner
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Scan patient QR codes for instant access to health records
              </p>
            </div>
            <QrCodeIcon className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Camera Scanner
              </h2>
              
              <div className="relative">
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                  {isScanning ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-primary-500 rounded-lg relative">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary-500"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary-500"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary-500"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Camera preview will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="mt-4 flex justify-center space-x-4">
                  {!isScanning ? (
                    <button
                      onClick={startScanning}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <CameraIcon className="w-5 h-5" />
                      <span>Start Scanning</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopScanning}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <CameraIcon className="w-5 h-5" />
                      <span>Stop Scanning</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleManualInput}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Manual Input
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scanned Data Display */}
            {scannedData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Scanned QR Code Data
                  </h2>
                  <button
                    onClick={clearScan}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <QrCodeIcon className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Health ID</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{scannedData.id}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <UserIcon className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Patient Name</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{scannedData.name}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <PhoneIcon className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Phone</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{scannedData.phone}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Registration Date</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {new Date(scannedData.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => window.open(`/patients/${scannedData.id}`, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>View Patient Details</span>
                  </button>
                  
                  <button
                    onClick={() => window.open(`/visits/log?patientId=${scannedData.id}`, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <HeartIcon className="w-4 h-4" />
                    <span>Log Visit</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scan History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Scans
              </h3>
              
              <div className="space-y-3">
                {scanHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent scans
                  </p>
                ) : (
                  scanHistory.map((scan) => (
                    <div key={scan.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {scan.success ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-600 mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {scan.patientName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {scan.scanTime.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ID: {scan.patientId}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                How to Use
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <p>Click "Start Scanning" to activate camera</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <p>Point camera at patient's QR code</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <p>Patient data will load automatically</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <p>Access patient records or log new visit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
