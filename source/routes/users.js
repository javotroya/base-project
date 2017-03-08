'use strict';
App.Router.Users = App.Helpers.Router.extend({
    className: 'Users',
    routes   : {
        'users'               : 'list',
        'user/profile/:userID': 'profile',
        'user/profile'        : 'profile'
    },
    list     : function(){
        let collection = new App.Collections.Users(),
            view       = new App.Views.Users.List({collection: collection});
        App.Helpers.html(view, '.content-wrapper');
        collection.fetch();
    },
    profile  : function(userID){
        userID = userID || parseInt(sessionStorage.getItem('id'), 10);
        let view, model;
        model  = new App.Models.User({id: userID});
        view   = new App.Views.Users.Profile({model: model});
        App.Helpers.html(view, '.content-wrapper');
        model.fetch();
    }
});

let UsersRouter = new App.Router.Users();
UsersRouter.on('route', function(actions){
    if(App.Const.debug){
        console.log(actions);
    }
});