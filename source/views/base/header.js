'use strict';

if (_.isUndefined(App.Views.Base)) {
    App.Views.Base = {};
}

App.Views.Base.Header = App.Helpers.View.extend({
    template: App.Templates.baseHeader,
    className: 'BaseHeader',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});