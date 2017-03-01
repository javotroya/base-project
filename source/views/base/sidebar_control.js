'use strict';

if (_.isUndefined(App.Views.Base)) {
    App.Views.Base = {};
}

App.Views.Base.SidebarControl = App.Helpers.View.extend({
    template: App.Templates.baseSidebarControl,
    className: 'control-sidebar control-sidebar-dark',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});