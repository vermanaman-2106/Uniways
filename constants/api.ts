// API Configuration
// For iOS Simulator/Android Emulator: use localhost
// For physical device: replace localhost with your computer's IP address
// Find your IP: Mac: ipconfig getifaddr en0 | Windows: ipconfig (look for IPv4)

export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api' // For simulator/emulator
  // ? 'http://YOUR_IP_ADDRESS:3000/api' // For physical device - uncomment and add your IP
  : 'http://localhost:3000/api'; // Production - update with your production URL

export const API_ENDPOINTS = {
  faculty: '/faculty',
  health: '/health',
  appointments: '/appointments',
  auth: '/auth',
};

