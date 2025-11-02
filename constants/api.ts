// API Configuration
// Production backend URL - used for Expo Go sharing and production builds
// For local development, you can temporarily change this to 'http://localhost:3000/api'

export const API_BASE_URL = 'https://uniways-backend.onrender.com/api';

// Alternative: Use localhost only when running locally (uncomment if needed)
// export const API_BASE_URL = __DEV__
//   ? 'http://localhost:3000/api' // For local development only
//   : 'https://uniways-backend.onrender.com/api'; // Production backend URL

export const API_ENDPOINTS = {
  faculty: '/faculty',
  health: '/health',
  appointments: '/appointments',
  complaints: '/complaints',
  auth: '/auth',
};

// Google Maps API Configuration
// For WebView method (current implementation): Use Maps JavaScript API key (ONE key for both platforms)
// For Native Maps method: Use separate Android and iOS keys

// Option 1: WebView Method (Recommended - Works with Expo Go)
// Use ONE Maps JavaScript API key - works for both Android and iOS
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDR0owZzM1Dwwm-61qZt7SzXmE8hpSo6x8'; // Maps JavaScript API key

// Option 2: Native Maps Method (If you want to use react-native-maps later)
// Uncomment these if you want to use native Google Maps
// export const GOOGLE_MAPS_API_KEY_ANDROID = 'YOUR_ANDROID_API_KEY_HERE';
// export const GOOGLE_MAPS_API_KEY_IOS = 'YOUR_IOS_API_KEY_HERE';

// Manipal University Jaipur Coordinates
export const MUJ_COORDINATES = {
  latitude: 26.843955690014237,
  longitude: 75.56526111841693,
};

