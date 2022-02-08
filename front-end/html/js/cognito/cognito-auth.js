var CognitoLogin = window.CognitoLogin || {};

(function scopeWrapper($) {
    // globals
    var userPool;

    // cognito user pool data
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

}(jQuery));