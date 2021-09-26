import * as React from 'react';
import { Button } from '@material-ui/core';
import { useFirebase } from 'shared';
import firebase from 'firebase/compat';

const GoogleSignInButton = () => {
  const { auth } = useFirebase();

  const handleClick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials = auth?.signInWithPopup(provider);
  };

  return (
    <Button onClick={handleClick} variant="outlined">
      Continue with Google
    </Button>
  );
};

export { GoogleSignInButton };
