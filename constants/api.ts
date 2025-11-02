// API Configuration
// For iOS Simulator/Android Emulator: use localhost
// For physical device: replace localhost with your computer's IP address
// Find your IP: Mac: ipconfig getifaddr en0 | Windows: ipconfig (look for IPv4)

export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api' // For simulator/emulator (local development)
  // ? 'http://YOUR_IP_ADDRESS:3000/api' // For physical device - uncomment and add your IP
  : 'https://uniways-backend.onrender.com/api'; // Production backend URL

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

