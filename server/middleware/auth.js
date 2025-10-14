// Mock authentication middleware for demo
const auth = (req, res, next) => {
  // For demo purposes, we'll skip authentication
  // In production, this would verify JWT tokens
  
  req.user = {
    id: 'demo-user-id',
    name: 'Demo User',
    email: 'demo@asha.gov.in',
    role: 'asha_worker'
  };
  
  next();
};

module.exports = auth;
