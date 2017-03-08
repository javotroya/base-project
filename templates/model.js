'use strict';
App.Models.<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %> = App.Helpers.Model.extend({
    idAttribute   : '',
    url      : function(){ return '/'; }
});
