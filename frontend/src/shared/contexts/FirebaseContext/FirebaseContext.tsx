import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat';
import Firestore = firebase.firestore.Firestore;
import Auth = firebase.auth.Auth;
import App = firebase.app.App;
import Analytics = firebase.analytics.Analytics;

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
  firebaseApp?: App;
  firebaseAnalytics?: Analytics;
  firestore?: Firestore;
  auth?: Auth;
}

const FirebaseContext = React.createContext<IFirebaseContext>({});

const FirebaseProvider = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;
  const [firebaseApp, setFirebaseApp] = useState<App>();
  const [firebaseAnalytics, setFirebaseAnalytics] = useState<Analytics>();
  const [firestore, setFirestore] = useState<Firestore>();
  const [auth, setAuth] = useState<Auth>();

  useEffect(() => {
    if (!firebase.apps.length) {
      const app = firebase.initializeApp(firebaseConfig);
      setFirebaseApp(app);
      setFirebaseAnalytics(firebase.analytics(app));
      setFirestore(firebase.firestore(app));
      setAuth(firebase.auth(app));
    }
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ firebaseApp, firebaseAnalytics, firestore, auth }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebase = () => {
  return useContext(FirebaseContext);
};

export { FirebaseContext, FirebaseProvider, useFirebase };
