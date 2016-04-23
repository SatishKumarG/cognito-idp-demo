
import React from 'react';
import { authenticateUser } from '../lib/idp';

const factory = (function componentFactory() {
  let usernameField = null;
  let passwordField = null;
  const handleClick = e => {
    e.preventDefault();
    const username = usernameField.value;
    const password = passwordField.value;
    authenticateUser({ username, password })
    .then(({ identityId }) => {
      console.log('User is authenticated and can now call AWS API with identityId =', identityId);
    });
  };
  return function loginComponent() {
    return (
      <div>
        <input defaultValue="simone1" ref={node => { usernameField = node; }} />
        <input defaultValue="asdASD123!" ref={node => { passwordField = node; }} />
        <button type="submit" onClick={handleClick}>Login</button>
      </div>
    );
  };
}());

export default factory;

