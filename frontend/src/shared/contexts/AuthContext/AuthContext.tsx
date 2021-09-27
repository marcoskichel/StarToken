import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useFirebase } from 'shared';
import { useHistory } from 'react-router-dom';
import { StudentRoutes } from 'students';

export enum AuthStatus {
  PENDING = 'pending',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

interface IAuthContext {
  loggedUser?: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  status: AuthStatus;
}

const AuthContext = createContext<IAuthContext>({
  loggedUser: null,
  status: AuthStatus.PENDING,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

const AuthProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const { auth } = useFirebase();
  const history = useHistory();

  const [loggedUser, setLoggedUser] = useState<User | undefined | null>();
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.PENDING);

  useEffect(() => {
    auth?.onAuthStateChanged((user) => {
      setLoggedUser(user);
    });
  }, [auth]);

  useEffect(() => {
    if (loggedUser) {
      setStatus(AuthStatus.AUTHENTICATED);
    } else {
      setStatus(
        loggedUser === null ? AuthStatus.UNAUTHENTICATED : AuthStatus.PENDING
      );
    }
  }, [loggedUser]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth!, provider);
      history.push(StudentRoutes.HOME);
    } catch (e) {
      console.error(e);
    }
  }, [auth, history]);

  const signOut = async () => {
    await auth?.signOut();
    history.push('/');
  };

  return (
    <AuthContext.Provider
      value={{ signInWithGoogle, loggedUser, signOut, status }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, AuthContext, useAuth };
