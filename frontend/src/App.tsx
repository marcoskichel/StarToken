import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProposalFormPage } from './proposals';
import { Symfoni } from './hardhat/SymfoniContext';
import { makeStyles } from '@material-ui/core';

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
          <div className={styles.app}>
            <Switch>
              <Route path="/">
                <ProposalFormPage />
              </Route>
            </Switch>
          </div>
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
