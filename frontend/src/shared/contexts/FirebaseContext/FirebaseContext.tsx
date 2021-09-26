import React, { useContext, useEffect, useState } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';

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

interface IFirebaseContext {
  firebaseApp?: FirebaseApp;
  firebaseAnalytics?: Analytics;
}

const FirebaseContext = React.createContext<IFirebaseContext>({});

const FirebaseProvider = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>();
  const [firebaseAnalytics, setFirebaseAnalytics] = useState<Analytics>();

  useEffect(() => {
    if (!firebaseApp) {
      const app = initializeApp(firebaseConfig);
      setFirebaseApp(app);
      setFirebaseAnalytics(getAnalytics(app));
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ firebaseApp, firebaseAnalytics }}>
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebase = () => {
  return useContext(FirebaseContext);
};

export { FirebaseContext, FirebaseProvider, useFirebase };
