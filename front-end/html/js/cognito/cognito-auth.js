var CognitoLogin = window.CognitoLogin || {};

(function scopeWrapper($) {
    // globals
    var userPool;
    var resetPassword = 'reset-password.html'
    var signinUrl = 'login.html';

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

    // cognito auth token
    CognitoLogin.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        }else {
            resolve(null);
        }
    });








    //-------------------------------------- FUNCTIONS --------------------------------------//
    
    // register account
    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    

    // forgot password
    function forgotPassword(email) {
        createCognitoUser(email).forgotPassword({
            onSuccess: function(result) {
                window.location.href = resetPassword;
            },
            onFailure: function(err) {
                // fix this
                alert(err);
            }
        });
    }

    function handleForgotPassword(event) {
        var email = $('#forgotPasswordEmail').val();
        event.preventDefault();
        forgotPassword(email);
    }

    // reset password
    function resetPasswordfunction(email, code, password) {
        createCognitoUser(email).confirmPassword(code, password, {
            onFailure(err) {
                alert(err);
            },
            onSuccess() {
                window.location.href = signinUrl;
            },
        });
    }

}(jQuery));