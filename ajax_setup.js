'use strict';

$.ajaxSetup({
    statusCode: {
        401: function(){
            App.loginModel.logout();
        }
    }
});
