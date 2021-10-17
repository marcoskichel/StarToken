import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ExitToApp as LogoutIcon, Menu as MenuIcon } from '@material-ui/icons';
import { Trans } from 'react-i18next';
import React from 'react';

const useStyles = makeStyles({
  container: {
    flexGrow: 1,
  },
  menuBtn: {
    marginRight: '16px',
  },
  title: { flexGrow: 1 },
  logoutBtn: {
    marginRight: '16px',
    color: 'inherit',
  },
});

interface Props {
  title: string;
  onMenuToggle: () => void;
  onSignOut: () => Promise<void>;
}

const NavigationBar = (props: Props) => {
  const styles = useStyles();
  const { title, onMenuToggle, onSignOut } = props;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          className={styles.menuBtn}
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" className={styles.title}>
          <Trans i18nKey={title} />
        </Typography>
        <IconButton className={styles.logoutBtn} onClick={onSignOut}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export { NavigationBar };
