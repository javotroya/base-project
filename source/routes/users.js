'use strict';
App.Router.Users = App.Helpers.Router.extend({
    className: 'Users',
    routes   : {
        'users' : 'list'
    },
    list : function(){
        console.log('users');
    }
});

let UsersRouter = new App.Router.Users();
UsersRouter.on('route', function(actions){
    if(App.Const.debug){
        console.log(actions);
    }
});