import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingData, setPendingData] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingData = async (type, data) => {
    // Mock offline sync
    const pendingItem = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    setPendingData(prev => [...prev, pendingItem]);
    localStorage.setItem('pendingData', JSON.stringify([...pendingData, pendingItem]));
  };

  const value = {
    isOnline,
    pendingData,
    syncPendingData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
