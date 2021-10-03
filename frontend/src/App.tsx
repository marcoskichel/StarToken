import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Symfoni } from './hardhat/SymfoniContext';
import {
  AuthProvider,
  FirebaseProvider,
  NotFoundPage,
  ProtectedRoute,
} from 'shared';
import { StudentHomePage, StudentRoutes, StudentSignInPage } from 'students';

function App() {
  return (
    <>
      <Symfoni showLoading={false} autoInit={false}>
        <FirebaseProvider>
          <AuthProvider>
            <div>
              <Switch>
                <Route path="/" exact>
                  <Redirect to={StudentRoutes.HOME} />
                </Route>

                <Route path={StudentRoutes.SIGN_IN} exact>
                  <StudentSignInPage />
                </Route>

                <ProtectedRoute path={StudentRoutes.HOME} exact>
                  <StudentHomePage />
                </ProtectedRoute>

                <Route>
                  <NotFoundPage />
                </Route>
              </Switch>
            </div>
          </AuthProvider>
        </FirebaseProvider>
      </Symfoni>
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
