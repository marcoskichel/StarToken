import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Symfoni } from './hardhat/SymfoniContext';
import { makeStyles } from '@material-ui/core';
import { FirebaseProvider, i18n } from 'shared';
import { StudentSignInPage } from 'students';

const useStyles = makeStyles({
  app: {
    maxWidth: '800px',
    margin: '0 auto',
  },
});

function App() {
  const styles = useStyles();
  return (
    <>
      <BrowserRouter>
        <Symfoni showLoading={false} autoInit={false}>
          <FirebaseProvider>
            <div className={styles.app}>
              <Route path="/" exact>
                <StudentSignInPage />
              </Route>
            </div>
          </FirebaseProvider>
        </Symfoni>
      </BrowserRouter>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </>
  );
}

export default App;
