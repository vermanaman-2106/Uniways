// Firebase core and auth
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAB08QaFr6-4wSz27XKnPVSey9gVj9zLhM",
  authDomain: "uniways-34aef.firebaseapp.com",
  projectId: "uniways-34aef",
  storageBucket: "uniways-34aef.firebasestorage.app",
  messagingSenderId: "886228810851",
  appId: "1:886228810851:web:687df93b7a0e486ee70c56",
};

// Initialize Firebase app and Auth
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use device language for auth emails
auth.useDeviceLanguage && auth.useDeviceLanguage();

// Auth helpers
export async function signUpWithEmailPassword(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmailPassword(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export function signOutUser() {
  return signOut(auth);
}

// Subscribe to auth state changes; returns unsubscribe function
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// Send verification email to current user
export async function sendVerificationEmail(user) {
  const targetUser = user || auth.currentUser;
  if (!targetUser) throw new Error('No user to verify');

  // Configure where the verification link should take the user
  const actionCodeSettings = {
    url: `https://${auth.config?.authDomain || 'uniways-34aef.firebaseapp.com'}`,
    handleCodeInApp: false,
  };

  return await sendEmailVerification(targetUser, actionCodeSettings);
}