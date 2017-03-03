'use strict';
App.Collections.Tasks = App.Helpers.Collection.extend({
    url      : function(){ return '/'; },
    model    : App.Models.Task
});