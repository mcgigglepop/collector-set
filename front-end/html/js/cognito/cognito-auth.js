var CognitoLogin = window.CognitoLogin || {};

(function scopeWrapper($) {
    // globals
    var userPool;

    // cognito user pool data
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    // instantiate user pool
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // set region
    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    // sign out
    CognitoLogin.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

}(jQuery));