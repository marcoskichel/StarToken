import { Box, makeStyles } from '@material-ui/core';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles({
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
});

interface Props {}

const Container = (props: PropsWithChildren<Props>) => {
  const styles = useStyles();
  const { children } = props;
  return <Box className={styles.container}>{children}</Box>;
};

export { Container };
