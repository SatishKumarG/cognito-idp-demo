import React from 'react';
import ReactDOM from 'react-dom';

import * as idp from './lib/idp';
import LoginComponent from './components/Login';
import LogoutComponent from './components/Logout';

idp.configure({
  region: 'us-east-1',
  identityPoolId: 'us-east-1:704822ca-d096-4ce9-8fee-172f38ae21e3',
  userPoolId: 'us-east-1_U5i6fZ4nQ',
  clientId: '6lcq6cc3ot5vfdli5o12tio2sa',
});

let onAction = null;
let appState = {};

function render() {
  const root = document.getElementById('app');
  const app = (
    <div>
      <h1>Welcome</h1>
      <LoginComponent {...appState} onAction={onAction} />
      <LogoutComponent {...appState} onAction={onAction} />
    </div>
  );
  ReactDOM.render(app, root);
}

onAction = action => {
  switch (action.type) {
    case 'login':
      console.log('User is authenticated and can now call AWS API with identityId =', action.identityId);
      appState = {
        ...appState,
        session: action.session, // @TODO: serialize session
        identityId: action.identityId,
      };
      render();
      break;
    case 'logout':
      alert('You are now logged out. Page needs to be refereshed.');
      location.reload();
      break;
    default:
      console.log(`Unknown action: '${action.type}'`);
  }
};

function tryRestoreSession() {
  return idp.restoreAuthenticatedUser()
  .then(params => {
    console.log('Found session', params);
    onAction({ type: 'login', ...params });
  })
  .catch(err => {
    console.log('Session cannot be restored or no previous session', err);
  });
}

idp.bootstrap()
.then(tryRestoreSession)
.then(() => render(appState));
