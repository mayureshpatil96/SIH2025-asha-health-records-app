import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {user?.name || 'ASHA Worker'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your health records and serve your community effectively.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/patients/register"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Register Patient
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add new patient to the system
            </p>
          </Link>

          <Link
            to="/visits/log"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Log Visit
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Record patient visit details
            </p>
          </Link>

          <Link
            to="/emergency"
            className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
              Emergency SOS
            </h3>
            <p className="text-red-600 dark:text-red-400">
              Send emergency alert
            </p>
          </Link>

          <Link
            to="/patients"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              View Patients
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse patient records
            </p>
          </Link>

          <Link
            to="/qr-scanner"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="text-4xl mb-4">🔲</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              QR Scanner
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Scan patient QR codes
            </p>
          </Link>

          <Link
            to="/analytics"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              View health trends and reports
            </p>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Patients</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Today's Visits</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Risk Cases</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Coverage Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
