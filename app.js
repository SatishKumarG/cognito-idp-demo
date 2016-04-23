import React from 'react';
import ReactDOM from 'react-dom';

import * as idp from './lib/idp';
import LoginComponent from './components/Login';

idp.configure({
  region: 'us-east-1',
  identityPoolId: 'us-east-1:704822ca-d096-4ce9-8fee-172f38ae21e3',
  userPoolId: 'us-east-1_U5i6fZ4nQ',
  clientId: '6lcq6cc3ot5vfdli5o12tio2sa',
});

const app = (
  <div>
    <h1>Welcome</h1>
    <LoginComponent />
  </div>
);

const root = document.getElementById('app');
idp.bootstrap()
.then(() => {
  ReactDOM.render(app, root);
});
