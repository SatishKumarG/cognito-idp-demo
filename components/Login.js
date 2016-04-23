
import React from 'react';
import { authenticateUser } from '../lib/idp';

const propTypes = {
  onAction: React.PropTypes.func.isRequired,
  identityId: React.PropTypes.string,
};

const factory = (function componentFactory() {
  let usernameField = null;
  let passwordField = null;
  const handleClickFactory = onAction => e => {
    e.preventDefault();
    const username = usernameField.value;
    const password = passwordField.value;
    authenticateUser({ username, password })
    .then(({ session, identityId }) => {
      onAction({ type: 'login', session, identityId });
    });
  };
  const loginComponent = ({ onAction, identityId }) => (
    <div>
      {identityId && <span>You're now logged in as {identityId}!</span>}
      <input defaultValue="simone1" ref={node => { usernameField = node; }} />
      <input defaultValue="asdASD123!" ref={node => { passwordField = node; }} />
      <button type="submit" onClick={handleClickFactory(onAction)}>Login</button>
    </div>
  );
  loginComponent.propTypes = propTypes;
  return loginComponent;
}());

export default factory;

