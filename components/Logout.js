
import React from 'react';
import { signOut } from '../lib/idp';

const propTypes = {
  onAction: React.PropTypes.func.isRequired,
  identityId: React.PropTypes.string,
};

const factory = (function componentFactory() {
  const handleClickFactory = onAction => e => {
    e.preventDefault();
    signOut()
    .then(() => onAction({ type: 'logout' }));
  };
  const loginComponent = ({ onAction, identityId }) => {
    if (!identityId) {
      return (<div>Not logged in (logout not available)</div>);
    }
    return (
      <div>
        <button type="submit" onClick={handleClickFactory(onAction)}>Logout</button>
      </div>
    );
  };
  loginComponent.propTypes = propTypes;
  return loginComponent;
}());

export default factory;

