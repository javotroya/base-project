'use strict';
App.Collections.Users = App.Helpers.Collection.extend({
    url      : function(){ return '/users'; },
    model    : App.Models.User
});