'use strict';
App.Router.Users = App.Helpers.Router.extend({
    className: 'Users',
    routes   : {
        'users' : 'list',
        'user/edit/:userID'  : 'edit'
    },
    list : function(){
        let collection = new App.Collections.Users(),
            view = new App.Views.Users.List({collection:collection});
        App.Helpers.html(view, '.content-wrapper');
        collection.fetch();
    },
    edit: function(userID){
        if($('.UsersList').length === 0){
            this.list();
        }
        let model = new App.Models.User({id:userID}),
            view = new App.Views.Users.Edit({model:model});
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