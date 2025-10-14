import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Patient API
export const patientAPI = {
  // Patient CRUD operations
  registerPatient: (patientData) => api.post('/patients', patientData),
  getPatients: (params = {}) => api.get('/patients', { params }),
  getPatientById: (id) => api.get(`/patients/${id}`),
  getPatientByHealthId: (healthId) => api.get(`/patients/health-id/${healthId}`),
  updatePatient: (id, patientData) => api.put(`/patients/${id}`, patientData),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  
  // Patient statistics and analytics
  getPatientStatistics: (params = {}) => api.get('/patients/statistics/overview', { params }),
  exportPatients: (params = {}) => api.get('/patients/export/csv', { params }),
  
  // Patient search and filters
  searchPatients: (query) => api.get('/patients/search', { params: { q: query } }),
  getPatientsByLocation: (location) => api.get('/patients/by-location', { params: location }),
  getHighRiskPatients: () => api.get('/patients/high-risk'),
};

// Visit API
export const visitAPI = {
  // Visit CRUD operations
  logVisit: (visitData) => api.post('/visits', visitData),
  getVisits: (params = {}) => api.get('/visits', { params }),
  getVisitById: (id) => api.get(`/visits/${id}`),
  updateVisit: (id, visitData) => api.put(`/visits/${id}`, visitData),
  deleteVisit: (id) => api.delete(`/visits/${id}`),
  
  // Visit types
  getVisitsByType: (type, params = {}) => api.get(`/visits/type/${type}`, { params }),
  getImmunizationVisits: (params = {}) => api.get('/visits/immunization', { params }),
  getAntenatalVisits: (params = {}) => api.get('/visits/antenatal', { params }),
  getPostnatalVisits: (params = {}) => api.get('/visits/postnatal', { params }),
  getIllnessVisits: (params = {}) => api.get('/visits/illness', { params }),
  
  // Visit analytics
  getVisitStatistics: (params = {}) => api.get('/visits/statistics', { params }),
  getUpcomingVisits: (params = {}) => api.get('/visits/upcoming', { params }),
  getOverdueVisits: (params = {}) => api.get('/visits/overdue', { params }),
  
  // Visit attachments
  uploadAttachment: (visitId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/visits/${visitId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAttachment: (visitId, attachmentId) => api.delete(`/visits/${visitId}/attachments/${attachmentId}`),
};

// Alert API
export const alertAPI = {
  // Emergency alerts
  sendEmergencyAlert: (alertData) => api.post('/alerts/emergency', alertData),
  getEmergencyAlerts: (params = {}) => api.get('/alerts/emergency', { params }),
  updateEmergencyAlert: (id, alertData) => api.put(`/alerts/emergency/${id}`, alertData),
  
  // Risk alerts
  getRiskAlerts: (params = {}) => api.get('/alerts/risk', { params }),
  acknowledgeAlert: (id) => api.put(`/alerts/${id}/acknowledge`),
  resolveAlert: (id, resolution) => api.put(`/alerts/${id}/resolve`, { resolution }),
  
  // Automated alerts
  getAutomatedAlerts: (params = {}) => api.get('/alerts/automated', { params }),
  sendReminder: (reminderData) => api.post('/alerts/reminder', reminderData),
  
  // Alert preferences
  getAlertPreferences: () => api.get('/alerts/preferences'),
  updateAlertPreferences: (preferences) => api.put('/alerts/preferences', preferences),
};

// Supervisor API
export const supervisorAPI = {
  // Dashboard data
  getDashboardData: (params = {}) => api.get('/supervisor/dashboard', { params }),
  getTeamPerformance: (params = {}) => api.get('/supervisor/team-performance', { params }),
  getAreaCoverage: (params = {}) => api.get('/supervisor/area-coverage', { params }),
  
  // ASHA worker management
  getAshaWorkers: (params = {}) => api.get('/supervisor/asha-workers', { params }),
  getAshaWorkerDetails: (id) => api.get(`/supervisor/asha-workers/${id}`),
  updateAshaWorker: (id, workerData) => api.put(`/supervisor/asha-workers/${id}`, workerData),
  
  // Reports and analytics
  generateReport: (reportType, params = {}) => api.get(`/supervisor/reports/${reportType}`, { params }),
  getPerformanceMetrics: (params = {}) => api.get('/supervisor/metrics', { params }),
  getComplianceReports: (params = {}) => api.get('/supervisor/compliance', { params }),
  
  // Notifications and communications
  sendNotification: (notificationData) => api.post('/supervisor/notifications', notificationData),
  getNotifications: (params = {}) => api.get('/supervisor/notifications', { params }),
};

// Incentive API
export const incentiveAPI = {
  // Incentive tracking
  getIncentives: (params = {}) => api.get('/incentives', { params }),
  getIncentiveById: (id) => api.get(`/incentives/${id}`),
  calculateIncentives: (params = {}) => api.post('/incentives/calculate', params),
  approveIncentive: (id, approvalData) => api.put(`/incentives/${id}/approve`, approvalData),
  
  // Incentive types and rates
  getIncentiveTypes: () => api.get('/incentives/types'),
  updateIncentiveRates: (rates) => api.put('/incentives/rates', rates),
  
  // Payment tracking
  getPaymentHistory: (params = {}) => api.get('/incentives/payments', { params }),
  processPayment: (paymentData) => api.post('/incentives/payments', paymentData),
  
  // Reports
  getIncentiveReports: (params = {}) => api.get('/incentives/reports', { params }),
  exportIncentiveData: (params = {}) => api.get('/incentives/export', { params }),
};

// QR Code API
export const qrAPI = {
  // QR code generation
  generateQRCode: (data) => api.post('/qr/generate', data),
  generatePatientQR: (patientId) => api.post(`/qr/patient/${patientId}`),
  
  // QR code scanning
  scanQRCode: (qrData) => api.post('/qr/scan', { qrData }),
  validateQRCode: (qrData) => api.post('/qr/validate', { qrData }),
  
  // QR code management
  getQRHistory: (params = {}) => api.get('/qr/history', { params }),
  deactivateQR: (id) => api.put(`/qr/${id}/deactivate`),
};

// Analytics API
export const analyticsAPI = {
  // Dashboard analytics
  getDashboardAnalytics: (params = {}) => api.get('/analytics/dashboard', { params }),
  getHealthTrends: (params = {}) => api.get('/analytics/health-trends', { params }),
  getCoverageAnalytics: (params = {}) => api.get('/analytics/coverage', { params }),
  
  // Performance analytics
  getPerformanceAnalytics: (params = {}) => api.get('/analytics/performance', { params }),
  getComplianceAnalytics: (params = {}) => api.get('/analytics/compliance', { params }),
  
  // Data visualization
  getChartData: (chartType, params = {}) => api.get(`/analytics/charts/${chartType}`, { params }),
  getHeatmapData: (params = {}) => api.get('/analytics/heatmap', { params }),
  
  // Export analytics
  exportAnalytics: (type, params = {}) => api.get(`/analytics/export/${type}`, { params }),
};

// Offline sync API
export const syncAPI = {
  // Offline data management
  syncOfflineData: (data) => api.post('/sync/offline-data', data),
  getPendingSync: () => api.get('/sync/pending'),
  markAsSynced: (ids) => api.put('/sync/mark-synced', { ids }),
  
  // Conflict resolution
  resolveConflicts: (conflicts) => api.post('/sync/resolve-conflicts', conflicts),
  getConflicts: () => api.get('/sync/conflicts'),
};

// File upload API
export const fileAPI = {
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
  getFileUrl: (fileId) => api.get(`/files/${fileId}/url`),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return { message, status: error.response.status };
    } else if (error.request) {
      // Request was made but no response received
      return { message: 'Network error. Please check your connection.', status: 0 };
    } else {
      // Something else happened
      return { message: 'An unexpected error occurred', status: -1 };
    }
  },

  // Build query parameters
  buildQueryParams: (params) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return queryParams.toString();
  },

  // Format date for API
  formatDateForAPI: (date) => {
    return date ? new Date(date).toISOString() : null;
  },

  // Parse API date
  parseAPIDate: (dateString) => {
    return dateString ? new Date(dateString) : null;
  }
};

export default api;
