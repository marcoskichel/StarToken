import React, { useContext, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import * as firestore from 'firebase/firestore';
import * as auth from 'firebase/auth';
import * as analytics from 'firebase/analytics';

export type FirebaseApp = firebase.FirebaseApp;
export type Firestore = firestore.Firestore;
export type Analytics = analytics.Analytics;
export type Auth = auth.Auth;

// TODO: Replace hardcoded values
const config = {
  apiKey: 'AIzaSyC8On9s3Xk2Xmq5MArYflw-oVgJ2S0GhBw',
  authDomain: 'startoken-8e085.firebaseapp.com',
  projectId: 'startoken-8e085',
  storageBucket: 'startoken-8e085.appspot.com',
  messagingSenderId: '936759987576',
  appId: '1:936759987576:web:cb66e95a52ccf4fd330c8d',
  measurementId: 'G-H1P5QKBGD7',
};

interface IFirebaseContext {
  app: FirebaseApp;
  analytics: Analytics;
  firestore: Firestore;
  auth: Auth;
}

const FirebaseContext = React.createContext<Partial<IFirebaseContext>>({});

const FirebaseProvider = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;
  const [appInstance, setAppInstance] = useState<FirebaseApp>();
  const [analyticsInstance, setAnalyticsInstance] = useState<Analytics>();
  const [firestoreInstance, setFirestoreInstance] = useState<Firestore>();
  const [firebaseAuth, setFirebaseAuth] = useState<Auth>();

  useEffect(() => {
    if (!firebaseAuth) {
      const app = firebase.initializeApp(config);
      setAppInstance(app);
      setAnalyticsInstance(analytics.getAnalytics(app));
      setFirestoreInstance(firestore.getFirestore(app));
      setFirebaseAuth(auth.getAuth(app));
    }
  }, [firebaseAuth]);

  return (
    <FirebaseContext.Provider
      value={{
        app: appInstance,
        analytics: analyticsInstance,
        firestore: firestoreInstance,
        auth: firebaseAuth,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebase = () => {
  return useContext(FirebaseContext);
};

export { FirebaseContext, FirebaseProvider, useFirebase };
