import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import { useSpeechRecognition } from 'react-speech-recognition';

const VoiceInput = ({ 
  onTranscript, 
  language = 'hi-IN', 
  continuous = false,
  className = '',
  placeholder = 'Click to start voice input...'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  const {
    transcript: speechTranscript,
    interimTranscript: speechInterimTranscript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    continuous,
    language,
    interimResults: true
  });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setSupported(false);
      return;
    }

    if (!isMicrophoneAvailable) {
      console.warn('Microphone not available');
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  useEffect(() => {
    if (speechTranscript !== transcript) {
      setTranscript(speechTranscript);
      onTranscript?.(speechTranscript);
    }
  }, [speechTranscript, transcript, onTranscript]);

  useEffect(() => {
    setInterimTranscript(speechInterimTranscript);
  }, [speechInterimTranscript]);

  const startListening = () => {
    if (!supported) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    if (!isMicrophoneAvailable) {
      alert('Microphone access is required for voice input');
      return;
    }

    setIsListening(true);
    resetTranscript();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    resetTranscript();
  };

  const languages = [
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'en-IN', name: 'English', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  if (!supported) {
    return (
      <div className={`p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg ${className}`}>
        <p className="text-red-700 dark:text-red-300 text-sm">
          Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Selection */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Language:</span>
        <select
          value={language}
          onChange={(e) => {
            // Language change would need to be handled by parent component
            console.log('Language changed to:', e.target.value);
          }}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Input Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isListening
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isListening ? (
            <>
              <StopIcon className="w-5 h-5" />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <MicrophoneIcon className="w-5 h-5" />
              <span>Start Voice Input</span>
            </>
          )}
        </button>

        {transcript && (
          <button
            onClick={clearTranscript}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Indicator */}
      {isListening && (
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 dark:text-gray-400">
            Listening in {currentLanguage?.name} ({currentLanguage?.flag})...
          </span>
        </div>
      )}

      {/* Transcript Display */}
      <div className="min-h-[100px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
        {transcript ? (
          <div>
            <p className="text-gray-900 dark:text-white mb-2">{transcript}</p>
            {interimTranscript && (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {interimTranscript}
              </p>
            )}
          </div>
        ) : interimTranscript ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            {interimTranscript}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            {placeholder}
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Speak clearly and at a normal pace</p>
        <p>• Make sure you're in a quiet environment</p>
        <p>• Allow microphone access when prompted</p>
        <p>• Click "Stop Listening" when you're done speaking</p>
      </div>
    </div>
  );
};

export default VoiceInput;
