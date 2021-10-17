import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Menu as MenuIcon, ExitToApp as LogoutIcon } from '@material-ui/icons';
import { Trans } from 'react-i18next';
import { NavigationDrawer, useAuth } from 'shared';
import { NavigationBar } from 'shared/containers/Navigation/NavigationBar';

interface Props {
  title?: string;
}

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

const Navigation = (props: Props) => {
  const { title = '' } = props;
  const { signOut } = useAuth();
  const styles = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleMenu = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box className={styles.container}>
      <NavigationBar
        title={title}
        onMenuToggle={toggleMenu}
        onSignOut={signOut}
      />
      <NavigationDrawer isOpen={isDrawerOpen} onToggle={toggleMenu} />
    </Box>
  );
};

export { Navigation };
