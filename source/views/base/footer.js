'use strict';

if (_.isUndefined(App.Views.Base)) {
    App.Views.Base = {};
}

App.Views.Base.Footer = App.Helpers.View.extend({
    template: App.Templates.baseFooter,
    className: 'BaseFooter',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});