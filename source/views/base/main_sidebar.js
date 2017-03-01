'use strict';

if (_.isUndefined(App.Views.Base)) {
    App.Views.Base = {};
}

App.Views.Base.MainSidebar = App.Helpers.View.extend({
    template: App.Templates.baseMainSidebar,
    className: 'sidebar',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});
