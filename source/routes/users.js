'use strict';
App.Router.Users = App.Helpers.Router.extend({
    className: 'Users',
    routes   : {
        'users' : 'list'
    },
    list : function(){
        let collection = new App.Collections.Users(),
            view = new App.Views.Users.List({collection:collection});
        collection.fetch();
    }
});

let UsersRouter = new App.Router.Users();
UsersRouter.on('route', function(actions){
    if(App.Const.debug){
        console.log(actions);
    }
});