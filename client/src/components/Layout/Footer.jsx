import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 ASHA Health Records Platform. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built with ❤️ for ASHA workers and community health in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
