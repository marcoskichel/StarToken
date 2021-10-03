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
import { useAuth } from 'shared';

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
  const { title } = props;
  const { signOut } = useAuth();
  const styles = useStyles();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Box className={styles.container}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            className={styles.menuBtn}
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" className={styles.title}>
            <Trans i18nKey={title} />
          </Typography>
          <IconButton className={styles.logoutBtn} onClick={signOut}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu}>
        <span>Menu content</span>
      </Drawer>
    </Box>
  );
};

export { Navigation };
