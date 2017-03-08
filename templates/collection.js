'use strict';
App.Collections.<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %> = App.Helpers.Collection.extend({
    url      : function(){ return '/'; },
    model    : App.Models.<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %>
});