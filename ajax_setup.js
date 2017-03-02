'use strict';
//logout for 401 responses.
$.ajaxSetup({
    statusCode: {
        401: function(){
            // Redirect the to the login page.
            App.loginModel.logout();

        }
    }
});
