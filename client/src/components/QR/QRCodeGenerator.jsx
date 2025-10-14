import React from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const QRCodeGenerator = ({ data, size = 150 }) => {
  // For demo purposes, we'll create a simple QR code placeholder
  // In production, you would use a QR code library like qrcode.react
  
  const qrDataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="bg-white p-4 rounded-lg shadow-soft border-2 border-dashed border-gray-300 dark:border-gray-600"
        style={{ width: size, height: size }}
      >
        {/* QR Code Placeholder */}
        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
          <QrCodeIcon className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Health ID QR Code
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Scan with ASHA app for instant access
        </p>
      </div>
      
      <div className="text-center max-w-xs">
        <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
          {qrDataString}
        </p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
