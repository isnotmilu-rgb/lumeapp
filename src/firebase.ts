// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from './config/firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  try {
    // Only initialize if we have a valid measurementId (indicates Analytics is set up)
    if (firebaseConfig.measurementId && firebaseConfig.measurementId !== 'G-XXXXXXXXXX') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
}

export { app, analytics };
export default app;