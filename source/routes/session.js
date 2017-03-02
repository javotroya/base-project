'use strict';
App.Router.Session = App.Helpers.Router.extend({
    className: 'Session',
    routes   : {
        'session/logout': 'logout'
    },
    logout   : function(){
        App.loginModel.logout();
    },
});

let SessionRouter = new App.Router.Session();
SessionRouter.on('route', function(actions){
    if(App.Const.debug){
        console.log(actions);
    }
});
