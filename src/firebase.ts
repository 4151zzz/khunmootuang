import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDtlDAynucFXs9FSfGodPNPDMTy1PjefZs",
  authDomain: "krunmootuang.firebaseapp.com",
  projectId: "krunmootuang",
  storageBucket: "krunmootuang.firebasestorage.app",
  messagingSenderId: "810103818592",
  appId: "1:810103818592:web:5749c34741a2491729b605",
  measurementId: "G-Z99X3RZ3EN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (safe for SSR / unsupported environments)
export const analyticsPromise = isSupported().then((supported) => {
  return supported ? getAnalytics(app) : null;
});

export default app;
