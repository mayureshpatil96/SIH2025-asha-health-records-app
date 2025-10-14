# ASHA Health Records Platform

A comprehensive digital health management system for ASHA (Accredited Social Health Activist) workers across India, featuring AI-powered alerts, offline capabilities, and real-time monitoring.

## 🚀 Features

### Core Functionality
- **Patient Registration & Demographics**: Digital health profiles with complete medical history
- **Visit Logging System**: Comprehensive tracking for immunization, antenatal, postnatal, and illness treatments
- **Offline Data Capture**: Works seamlessly without internet, auto-syncs when online
- **AI Risk Alerts**: Advanced AI system identifies high-risk cases early
- **Emergency SOS Button**: One-touch emergency alerts to nearest health facilities
- **Geo-Tagging**: GPS tracking ensures complete village coverage
- **Voice Input**: Multi-language support (Hindi + Regional languages)
- **QR Code Health ID**: Unique QR codes for instant patient identification

### Advanced Features
- **Supervisor Dashboard**: Real-time analytics and performance monitoring
- **Digital Incentive Tracker**: Automated tracking of ASHA worker incentives
- **Training Modules**: Interactive guides and step-by-step tutorials
- **Data Visualization**: Comprehensive charts and trends analysis
- **Automated Alerts**: n8n workflow integration for smart reminders
- **Multi-language Support**: Hindi, English, and regional languages

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **Nodemailer** - Email notifications

### Additional Services
- **Web Speech API** - Voice recognition
- **Geolocation API** - GPS tracking
- **IndexedDB** - Offline storage
- **Service Workers** - Offline functionality
- **QR Code Library** - QR generation/scanning

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/asha-health-records-app.git
cd asha-health-records-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
```bash
# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Database Setup
```bash
# Start MongoDB (if using local instance)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 5. Run the Application
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Mobile Support

The platform is fully responsive and works on:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Tablet**: iPad, Android tablets
- **PWA**: Can be installed as a mobile app

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection string | `mongodb://localhost:27017/asha-health-records` |
| `JWT_SECRET` | JWT signing secret | Required |
| `EMAIL_HOST` | SMTP server | Required for notifications |
| `GOOGLE_MAPS_API_KEY` | Maps API key | Required for GPS features |

### Feature Flags

Enable/disable features in `.env`:
```env
ENABLE_OFFLINE_MODE=true
ENABLE_VOICE_INPUT=true
ENABLE_QR_SCANNING=true
ENABLE_AI_ALERTS=true
ENABLE_EMERGENCY_SOS=true
```

## 🏗️ Project Structure

```
asha-health-records-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── tailwind.config.js
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── uploads/              # File uploads
├── logs/                 # Application logs
├── package.json
└── README.md
```

## 🔐 Authentication

The platform uses JWT-based authentication with role-based access control:

- **ASHA Workers**: Can register patients, log visits, access their assigned patients
- **Supervisors**: Can view analytics, manage ASHA workers, generate reports
- **Administrators**: Full system access

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

### Patient Management
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Register new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Visit Logging
- `GET /api/visits` - Get all visits
- `POST /api/visits` - Log new visit
- `GET /api/visits/:id` - Get visit by ID
- `PUT /api/visits/:id` - Update visit

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/health-trends` - Health trends
- `GET /api/analytics/coverage` - Coverage analytics
- `GET /api/analytics/performance` - Performance metrics

## 🚨 Emergency Features

### SOS System
- One-touch emergency alerts
- GPS location sharing
- Automatic notification to nearest health facilities
- Integration with emergency services

### Risk Assessment
- AI-powered risk detection
- Automated alerts for high-risk cases
- Priority-based case management
- Supervisor notifications

## 📱 Offline Support

The platform works offline using:
- **IndexedDB** for local data storage
- **Service Workers** for caching
- **Background sync** when online
- **Conflict resolution** for data synchronization

## 🔄 Data Synchronization

- **Real-time sync** when online
- **Batch sync** for offline data
- **Conflict resolution** for concurrent edits
- **Data integrity** checks
- **Backup and restore** functionality

## 🎯 Performance Optimization

- **Code splitting** for faster loading
- **Image optimization** and lazy loading
- **Database indexing** for faster queries
- **Caching strategies** for improved performance
- **CDN integration** for static assets

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Start production server
cd ..
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t asha-health-records .

# Run container
docker run -p 5000:5000 asha-health-records
```

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Set up email/SMS services
4. Configure AI/ML services
5. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ministry of Health & Family Welfare, Government of India
- ASHA workers across India
- Open source community
- Healthcare technology contributors

## 📞 Support

For support and questions:
- **Email**: support@asha-health-records.gov.in
- **Documentation**: [Wiki](https://github.com/your-username/asha-health-records-app/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/asha-health-records-app/issues)

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Patient registration and management
- ✅ Visit logging system
- ✅ Offline support
- ✅ Basic analytics

### Phase 2 (Next)
- 🔄 AI-powered risk assessment
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app (React Native)
- 🔄 Integration with government systems

### Phase 3 (Future)
- 📋 Blockchain integration
- 📋 Advanced AI/ML features
- 📋 IoT device integration
- 📋 Telemedicine capabilities

---

**Built with ❤️ for ASHA workers and community health in India**