'use strict';
if (_.isUndefined(App.Views.Users)) {
    App.Views.Users = {};
}
App.Views.Users.Edit = App.Helpers.View.extend({
    template: App.Templates.usersEdit,
    className: 'UsersEdit',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});