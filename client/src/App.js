import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { VoiceProvider } from './contexts/VoiceContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientRegistration from './components/Patients/PatientRegistration';
import PatientList from './pages/Patients/PatientList';
import PatientDetail from './pages/Patients/PatientDetail';
import VisitLogging from './components/Visits/VisitLogging';
import VisitHistory from './pages/Visits/VisitHistory';
import EmergencySOS from './components/Emergency/EmergencySOS';
import SupervisorDashboard from './pages/Supervisor/SupervisorDashboard';
import Analytics from './pages/Analytics/Analytics';
import IncentiveTracker from './pages/Incentives/IncentiveTracker';
import TrainingModules from './pages/Training/TrainingModules';
import QRScanner from './components/QR/QRScanner';
import Profile from './pages/Profile/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OfflineProvider>
          <VoiceProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <main className="relative">
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      
                      {/* Protected Routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      
                      {/* Patient Management */}
                      <Route path="/patients/register" element={
                        <ProtectedRoute>
                          <PatientRegistration />
                        </ProtectedRoute>
                      } />
                      <Route path="/patients" element={
                        <ProtectedRoute>
                          <PatientList />
                        </ProtectedRoute>
                      } />
                      <Route path="/patients/:id" element={
                        <ProtectedRoute>
                          <PatientDetail />
                        </ProtectedRoute>
                      } />
                      
                      {/* Visit Management */}
                      <Route path="/visits/log" element={
                        <ProtectedRoute>
                          <VisitLogging />
                        </ProtectedRoute>
                      } />
                      <Route path="/visits/history" element={
                        <ProtectedRoute>
                          <VisitHistory />
                        </ProtectedRoute>
                      } />
                      
                      {/* Emergency */}
                      <Route path="/emergency" element={
                        <ProtectedRoute>
                          <EmergencySOS />
                        </ProtectedRoute>
                      } />
                      
                      {/* Supervisor Routes */}
                      <Route path="/supervisor/dashboard" element={
                        <ProtectedRoute role="supervisor">
                          <SupervisorDashboard />
                        </ProtectedRoute>
                      } />
                      
                      {/* Analytics */}
                      <Route path="/analytics" element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      } />
                      
                      {/* Incentives */}
                      <Route path="/incentives" element={
                        <ProtectedRoute>
                          <IncentiveTracker />
                        </ProtectedRoute>
                      } />
                      
                      {/* Training */}
                      <Route path="/training" element={
                        <ProtectedRoute>
                          <TrainingModules />
                        </ProtectedRoute>
                      } />
                      
                      {/* QR Scanner */}
                      <Route path="/qr-scanner" element={
                        <ProtectedRoute>
                          <QRScanner />
                        </ProtectedRoute>
                      } />
                      
                      {/* Profile */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      
                      {/* 404 Route */}
                      <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                              404 - Page Not Found
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                              The page you're looking for doesn't exist.
                            </p>
                            <a 
                              href="/dashboard" 
                              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Go to Dashboard
                            </a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </React.Suspense>
                </main>
                <Footer />
                
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </VoiceProvider>
        </OfflineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
