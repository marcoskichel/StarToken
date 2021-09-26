import { createTheme } from '@material-ui/core/styles';

const appTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export { appTheme };
