import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Registration form will be implemented here.
          </p>
          <Link
            to="/login"
            className="mt-4 block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
