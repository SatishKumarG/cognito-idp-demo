/* global AWS, AWSCognito */

/*
  Required dependencies for cognito & cognito-idenity SDKs
  http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn.js
  http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn2.js
  https://s3-eu-west-1.amazonaws.com/tinkercareer-baws-support/sjcl.js
  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js
  https://rawgit.com/aws/amazon-cognito-identity-js/master/dist/aws-cognito-sdk.min.js
  https://rawgit.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js
  https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.3.5/aws-sdk.min.js
  https://rawgit.com/aws/amazon-cognito-js/master/dist/amazon-cognito.min.js
*/

let AWS_REGION = null;
let AWS_COGNITO_IDENTITY_POOL_ID = null;
let AWS_COGNITO_IDP_USER_POOL_ID = null;
let AWS_COGNITO_IDP_CLIENT_ID = null;
let userPool = null;


// == Helper methods ==
// all of the following methods return a Promise
//

function getCredentials() {
  return new Promise(resolve => {
    AWS.config.credentials.get(resolve);
  });
}

function createUserPool() {
  const poolData = {
    UserPoolId: AWS_COGNITO_IDP_USER_POOL_ID,
    ClientId: AWS_COGNITO_IDP_CLIENT_ID,
  };
  const newUserPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  return Promise.resolve(newUserPool);
}

function setCognitoIdentityCredentials(session) {
  const token = session.getIdToken().getJwtToken();
  AWS.config.credentials.params.Logins = {
    [`cognito-idp.${AWS.config.region}.amazonaws.com/${AWS_COGNITO_IDP_USER_POOL_ID}`]: token,
  };
  AWS.config.credentials.expired = true;
  return getCredentials()
  .then(() => {
    const identityId = AWS.config.credentials.identityId;
    return Promise.resolve({ session, identityId });
  });
}

function getCurrentSession() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser === null) {
    return Promise.reject(new Error('No current session'));
  }
  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
}


// == Public API ==
//

export function configure({
  region,
  identityPoolId,
  userPoolId,
  clientId,
}) {
  AWS_REGION = region;
  AWS_COGNITO_IDENTITY_POOL_ID = identityPoolId;
  AWS_COGNITO_IDP_USER_POOL_ID = userPoolId;
  AWS_COGNITO_IDP_CLIENT_ID = clientId;
  return Promise.resolve();
}

export function bootstrap(identityPoolId) {
  // -- credential provider configuration
  AWS.config.region = AWS_REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
  });
  AWSCognito.config.region = AWS.config.region;
  AWSCognito.config.credentials = AWS.config.credentials;
  return getCredentials()
  .then(createUserPool)
  .then(newUserPool => { userPool = newUserPool; })
  .catch(err => Promise.reject(err));
}

export function authenticateUser({ username, password }) {
  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
    Username: username,
    Pool: userPool,
  });
  const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
    Username: username,
    Password: password,
  });
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(session) {
        setCognitoIdentityCredentials(session)
        .then(resolve)
        .catch(reject);
      },
      onFailure: reject,
    }, cognitoUser);
  });
}
