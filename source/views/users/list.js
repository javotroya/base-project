'use strict';

if (_.isUndefined(App.Views.Users)) {
    App.Views.Users = {};
}

App.Views.Users.List = App.Helpers.View.extend({
    template: App.Templates.usersList,
    className: 'UsersList',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
        let self = this;
        this.listenTo(this.collection, 'sync', function(){
            self.$el.find('table').DataTable({
                'language': App.Const.dataTableLang
            });
        });
    },
    events: {
        'click [data-toggle="edit-user"]' : 'editUser'
    },
    afterRender: function(){
        this.addHeader({header:'Usuarios'});
    },
    editUser: function(e){
        let userID = $(e.currentTarget).data('user-id');
        Backbone.history.navigate(`user/profile/${userID}`, {trigger: true});
    }
});