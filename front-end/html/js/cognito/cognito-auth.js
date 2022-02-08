var CognitoLogin = window.CognitoLogin || {};

(function scopeWrapper($) {

    // cognito user pool data
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

}(jQuery));