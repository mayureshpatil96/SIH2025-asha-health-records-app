import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Digital ASHA Health Records Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Comprehensive digital health management system with AI-powered alerts, 
              offline capabilities, and real-time monitoring for ASHA workers across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive ASHA Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything ASHA workers need for effective community health management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Patient Registration & Demographics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Digital health profiles with complete medical history, eliminating paper registers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Visit Logging System
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive visit tracking for immunization, antenatal, postnatal, and illness treatments.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Offline Data Capture
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Works seamlessly without internet in remote villages. Automatic sync when online.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                AI Risk Alerts
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI system identifies high-risk cases early for immediate attention.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Emergency SOS Button
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                One-touch emergency alert system instantly notifies nearest doctors and health centers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Voice Input Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Multi-language voice recognition for Hindi and regional languages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
