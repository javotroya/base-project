'use strict';
App.Models.User = App.Helpers.Model.extend({
    url      : function(){
        if(!_.isUndefined(this.id)){
            return `/user/${this.id}`;
        }
        return '/user';
    }
});