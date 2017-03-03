'use strict';

App.Views.Task = App.Helpers.View.extend({
    template: App.Templates.task,
    className: 'Task',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});