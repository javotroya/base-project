'use strict';

App.Collections.Access = App.Helpers.Collection.extend({
    url: function(){
        if(!_.isUndefined(this.hierarchical)) {
            return '/api/access_controller/get_acl_tree/1';
        }
        return '/api/access_controller/get_acl_tree';
    }
});
