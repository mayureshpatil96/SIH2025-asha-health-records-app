import React, { createContext, useContext, useState } from 'react';

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    // Mock voice recognition for demo
    setIsListening(true);
    setTranscript('');
    
    // Simulate voice input after 2 seconds
    setTimeout(() => {
      setTranscript('Sample voice input text');
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const value = {
    isListening,
    transcript,
    startListening,
    stopListening
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};
