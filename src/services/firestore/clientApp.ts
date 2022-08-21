import { firestore } from 'firebase-admin';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: process.env.CLOUD_FUNCTION_API_KEY,
  authDomain: process.env.CLOUD_FUNCTION_AUTH_DOMAIN,
  projectId: process.env.CLOUD_FUNCTION_PROJECT_ID,
  storageBucket: process.env.CLOUD_FUNCTION_STORAGE_BUCKET,
  messagingSenderId: process.env.CLOUD_FUNCTION_MESSAGING_SENDER_ID,
  appId: process.env.CLOUD_FUNCTION_APP_ID,
  measurementId: process.env.CLOUD_FUNCTION_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = firestore();

// getAnalytics(app);
