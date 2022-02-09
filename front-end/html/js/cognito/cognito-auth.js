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

    $(function onDocReady() {
        $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
        $('#forgotPasswordForm').submit(handleForgotPassword);
        $('#resetPasswordForm').submit(handleResetPassword);
    });

    //-------------------------------------- FUNCTIONS --------------------------------------//

    // create cognito user
    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }
    
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

    function handleRegister(event) {
        var email = $('#registerEmail').val();
        var password = $('#registerFirstPassword').val();
        var password2 = $('#registerSecondPassword').val();

        var onSuccess = function registerSuccess(result) {
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    // verify
    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function handleVerify(event) {
        var email = $('#verifyEmail').val();
        var code = $('#verifyCode').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                alert('Verification successful. You will now be redirected to the login page.');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }

    // sign in 
    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function handleSignin(event) {
        var email = $('#loginEmail').val();
        var password = $('#loginPassword').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                window.location.href = 'core/dashboard.html';
            },
            function signinError(err) {
                alert(err);
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

    function handleResetPassword(event) {
        var email = $('#verifyResetEmail').val();
        var code = $('#verifyResetCode').val();
        var password = $('#verifyResetPassword').val();

        event.preventDefault();
        resetPasswordfunction(email, code, password);
    }

}(jQuery));