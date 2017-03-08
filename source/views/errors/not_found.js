'use strict';
if (_.isUndefined(App.Views.Errors)) {
    App.Views.Errors = {};
}
App.Views.Errors.NotFound = App.Helpers.View.extend({
    template: App.Templates.errorsNotFound,
    className: 'ErrorsNotFound',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    },
    afterRender: function(){
        this.addHeader({header:'Error 404'});
    }
});