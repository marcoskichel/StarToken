import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// TODO: Replace hardcoded values
const firebaseConfig = {
  apiKey: 'AIzaSyC8On9s3Xk2Xmq5MArYflw-oVgJ2S0GhBw',
  authDomain: 'startoken-8e085.firebaseapp.com',
  projectId: 'startoken-8e085',
  storageBucket: 'startoken-8e085.appspot.com',
  messagingSenderId: '936759987576',
  appId: '1:936759987576:web:cb66e95a52ccf4fd330c8d',
  measurementId: 'G-H1P5QKBGD7',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
