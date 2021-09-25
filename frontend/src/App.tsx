import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProposalForm } from './proposals';
import { Symfoni } from './hardhat/SymfoniContext';

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Symfoni>
            <Switch>
              <Route path="/">
                <ProposalForm />
              </Route>
            </Switch>
          </Symfoni>
        </BrowserRouter>
      </div>
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
