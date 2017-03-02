'use strict';

if (_.isUndefined(App.Views.Users)) {
    App.Views.Users = {};
}

App.Views.Users.List = App.Helpers.View.extend({
    template: App.Templates.usersList,
    className: 'UsersList',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});