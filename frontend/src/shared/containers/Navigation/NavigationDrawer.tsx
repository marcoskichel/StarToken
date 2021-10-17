import React from 'react';
import { Box, Divider, Drawer, makeStyles, Toolbar } from '@material-ui/core';
import { StudentMenu } from './StudentMenu';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const useStyles = makeStyles({
  drawer: {
    minWidth: '300px',
  },
});

const NavigationDrawer = (props: Props) => {
  const { onToggle, isOpen } = props;
  const styles = useStyles();
  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={isOpen}
      onClose={onToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Box className={styles.drawer}>
        <Toolbar />
        <Divider />
        <StudentMenu />
        <Divider />
      </Box>
    </Drawer>
  );
};

export { NavigationDrawer };
