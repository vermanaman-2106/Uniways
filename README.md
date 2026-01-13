# Uniways - Campus Management Mobile App 📱

A comprehensive campus management mobile application designed specifically for **Manipal University Jaipur (MUJ)**. Built with React Native (Expo) and Node.js/Express backend.

## 📋 Overview

Uniways serves as a one-stop solution for students and faculty to manage campus activities, access information, and streamline communication. The app provides essential tools for faculty discovery, appointment booking, complaint management, parking availability, and campus navigation.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: JWT-based authentication with email validation
- **Email Domain Restriction**: Only `@muj.manipal.edu` or `@jaipur.manipal.edu` emails allowed
- **Role-Based Access**: Separate interfaces for students and faculty
- **Password Reset**: Email-based password reset flow with secure tokens

### 👨‍🏫 Faculty Directory
- Browse complete faculty list from database
- **Search Functionality**: Search by name, department, email, or designation
- **Detailed Profiles**: View faculty contact information, office location, bio, and more
- **Pull-to-Refresh**: Refresh faculty data on demand

### 📅 Appointment System
- **For Students**:
  - Book appointments with faculty members
  - Select date, time, and duration (15/30/45/60 minutes)
  - View all appointments with status tracking
  - Filter by status (pending, approved, rejected, completed, cancelled)
  - Cancel appointments (if pending)
  
- **For Faculty**:
  - View all appointment requests
  - Approve or reject requests
  - Add meeting links (Zoom, Google Meet, etc.)
  - Add notes for students
  - Email notifications for new requests

### 📋 Complaint Ticket System
- **Submit Complaints**: Report infrastructure issues (AC, projector, WiFi, furniture, etc.)
- **Priority Levels**: Set priority (low, medium, high, urgent)
- **Status Tracking**: Track complaint status (pending, in_progress, resolved, closed)
- **Location Details**: Specify location, building, and floor
- **Admin Management**: Admins can update status, assign staff, and add notes

### 🚗 Parking Availability
- Real-time parking availability display
- Multiple parking lots (A, B, C, D, E)
- Color-coded availability indicators
- Percentage and progress bar visualization

### 🗺️ Campus Map
- Google Maps integration with WebView
- 3D satellite view centered on Manipal University Jaipur
- Interactive map with zoom, pan, and rotate capabilities

## 🛠️ Tech Stack

### Frontend
- **React Native**: `0.81.5`
- **Expo SDK**: `~54.0.20`
- **Expo Router**: `~6.0.13` (file-based routing)
- **TypeScript**: `^5.9.2`
- **AsyncStorage**: Token and user data persistence
- **React Native WebView**: Google Maps integration

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Nodemailer**: Email service (SendGrid/Gmail/Resend support)

### External Services
- **Google Maps JavaScript API**: Map integration
- **Render.com**: Backend hosting (production)
- **MongoDB Atlas**: Database hosting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB database (local or Atlas)
- Google Maps API key (for map feature)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration (choose one)
   # Option 1: SendGrid (Recommended)
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_ADDRESS=noreply@yourdomain.com
   
   # Option 2: Gmail
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_app_password
   
   # Option 3: Resend
   RESEND_API_KEY=your_resend_api_key
   
   # Frontend URL (for password reset links)
   FRONTEND_URL=http://localhost:8081
   ```

4. **Start the backend server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The server will run on `http://localhost:5000` (or your configured PORT).

### Frontend Setup

1. **Navigate to uniways directory**:
   ```bash
   cd uniways
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   Edit `constants/api.ts`:
   ```typescript
   export const API_BASE_URL = 'http://localhost:3000/api'; // Local development
   // or
   export const API_BASE_URL = 'https://uniways-backend.onrender.com/api'; // Production
   ```

4. **Configure Google Maps API key**:
   Edit `constants/api.ts`:
   ```typescript
   export const GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key';
   ```

5. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

6. **Run on your device/emulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
uniways/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout & navigation
│   ├── index.tsx                 # Home screen
│   ├── welcome.tsx               # Welcome/splash screen
│   ├── login.tsx                 # Login page
│   ├── signup.tsx                # Registration page
│   ├── forgot-password.tsx       # Password reset request
│   ├── reset-password.tsx        # Password reset form
│   ├── faculty.tsx               # Faculty directory
│   ├── faculty/[id].tsx          # Faculty profile details
│   ├── parking.tsx               # Parking availability
│   ├── map.tsx                   # Campus map
│   ├── appointments/
│   │   ├── index.tsx             # Appointments list
│   │   ├── book.tsx              # Book appointment
│   │   └── [id].tsx              # Appointment details
│   └── complaints/
│       ├── index.tsx             # Complaints list
│       ├── create.tsx            # Create complaint
│       └── [id].tsx              # Complaint details
├── components/
│   ├── themed-text.tsx           # Custom text component
│   └── themed-view.tsx           # Custom view component
├── constants/
│   ├── api.ts                    # API configuration & endpoints
│   └── theme.ts                  # Theme constants (colors, spacing)
├── assets/                       # Images and static assets
└── package.json

backend/
├── models/                       # Mongoose models
│   ├── User.js                   # User model
│   ├── Faculty.js                 # Faculty profile model
│   ├── Appointment.js            # Appointment model
│   └── Complaint.js              # Complaint model
├── controllers/                  # Route controllers
│   ├── authController.js         # Authentication logic
│   ├── facultyController.js      # Faculty operations
│   ├── appointmentController.js  # Appointment operations
│   └── complaintController.js    # Complaint operations
├── routes/                       # Express routes
│   ├── index.js                  # Main router
│   ├── auth.js                   # Auth routes
│   ├── faculty.js                # Faculty routes
│   ├── appointments.js           # Appointment routes
│   └── complaints.js             # Complaint routes
├── middleware/
│   └── auth.js                   # JWT authentication middleware
├── config/
│   ├── database.js               # MongoDB connection
│   └── email.js                  # Email configuration
├── utils/
│   └── sendEmail.js              # Email utility functions
└── server.js                     # Express server entry point
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Faculty (`/api/faculty`)
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:id` - Get faculty details
- `POST /api/faculty` - Create faculty member (admin)

### Appointments (`/api/appointments`)
- `POST /api/appointments` - Create appointment (student only)
- `GET /api/appointments/my-appointments` - Get user's appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update appointment status (faculty)
- `GET /api/appointments/faculty` - Get faculty list for booking
- `GET /api/appointments/pending` - Get pending appointments (faculty)

### Complaints (`/api/complaints`)
- `POST /api/complaints` - Create complaint (student/faculty)
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (admin/staff)
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id/status` - Update complaint status (admin/staff)
- `DELETE /api/complaints/:id` - Delete complaint (admin/staff)

### Health Check
- `GET /api/health` - API health status

## 🔐 Security Features

- **Password Security**: Bcrypt hashing with salt rounds (minimum 6 characters)
- **JWT Authentication**: Token-based authentication with 30-day expiration
- **Email Validation**: Domain-restricted registration
- **Role-Based Access Control**: Different permissions for students, faculty, and admin
- **Protected Routes**: Middleware protection on sensitive endpoints
- **Secure Token Storage**: AsyncStorage for token persistence

## 🎨 Design System

- **Primary Color**: Orange (`#FF6B35`)
- **Theme**: Consistent orange and white color scheme
- **Typography**: Custom ThemedText component with multiple variants
- **Spacing**: Consistent spacing constants
- **Icons**: Emoji-based icons for quick recognition

## 📱 User Roles

### Student
- View faculty profiles
- Book appointments with faculty
- Submit complaints
- Check parking availability
- Access campus map

### Faculty
- View own profile
- Manage appointments (approve/reject)
- View and manage complaints
- Access all campus features

### Admin/Staff
- Manage all complaints
- View all appointments
- System administration

## 🚀 Development

### Running Locally

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd uniways
   npx expo start
   ```

### Testing API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get all faculty
curl http://localhost:5000/api/faculty

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@muj.manipal.edu","password":"password123"}'
```

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `SENDGRID_API_KEY` - SendGrid API key (optional)
- `EMAIL_USER` - Gmail username (optional)
- `EMAIL_PASSWORD` - Gmail app password (optional)
- `RESEND_API_KEY` - Resend API key (optional)
- `FROM_ADDRESS` - Email sender address
- `FRONTEND_URL` - Frontend URL for password reset links

### Frontend (constants/api.ts)
- `API_BASE_URL` - Backend API URL
- `GOOGLE_MAPS_API_KEY` - Google Maps API key

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use**:
```bash
lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error**:
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for all)

### Frontend Issues

**API Connection Error**:
- Make sure backend is running
- Check `API_BASE_URL` in `constants/api.ts`
- For device testing, use your computer's IP address instead of `localhost`

**Google Maps Not Loading**:
- Verify `GOOGLE_MAPS_API_KEY` is set in `constants/api.ts`
- Check API key has Maps JavaScript API enabled

## 📚 Additional Documentation

- [App Description](../APP_DESCRIPTION.md) - Complete feature documentation
- [Setup Instructions](../SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [Backend README](../backend/README.md) - Backend-specific documentation
- [Email Setup](../backend/EMAIL_SETUP.md) - Email configuration guide
- [Environment Setup](../backend/ENV_SETUP.md) - Environment variables guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC License

## 👥 Authors

Uniways Development Team

## 🙏 Acknowledgments

- Manipal University Jaipur for the opportunity
- Expo team for the amazing framework
- All contributors and testers

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Platform**: iOS, Android, Web (via Expo)  
**Backend**: Node.js/Express on Render.com  
**Database**: MongoDB Atlas
