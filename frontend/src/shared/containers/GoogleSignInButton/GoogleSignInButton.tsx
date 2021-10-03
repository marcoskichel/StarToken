import * as React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useAuth } from 'shared';
import googleIcon from 'assets/icons/google_icon.png';
import { Trans } from 'react-i18next';

const useStyles = makeStyles({
  icon: {
    height: '24px',
  },
});

const GoogleSignInButton = () => {
  const { signInWithGoogle } = useAuth();
  const styles = useStyles();

  return (
    <Button
      onClick={signInWithGoogle}
      variant="outlined"
      startIcon={<img src={googleIcon} className={styles.icon} alt="Google" />}
    >
      <Trans i18nKey="shared__continue_with_google" />
    </Button>
  );
};

export { GoogleSignInButton };
