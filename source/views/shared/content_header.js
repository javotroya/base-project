'use strict';

if (_.isUndefined(App.Views.Shared)) {
    App.Views.Shared = {};
}

App.Views.Shared.ContentHeader = App.Helpers.View.extend({
    template: App.Templates.sharedContentHeader,
    className: 'content-header',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
        this.header = this.options.header || '';
        this.description = this.options.description || '';
    },
    events: {

    }
});