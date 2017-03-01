'use strict';

if (_.isUndefined(App.Views.Test)) {
    App.Views.Test = {};
}

App.Views.Test.Index = App.Helpers.View.extend({
    template: App.Templates.testIndex,
    className: 'TestIndex',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});