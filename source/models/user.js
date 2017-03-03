'use strict';
App.Models.User = App.Helpers.Model.extend({
    idAttribute   : '',
    url      : function(){ return '/user'; }
});