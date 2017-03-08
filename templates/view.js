'use strict';

<% if(!_.isEmpty(meta.package)){
print(`if(_.isUndefined(App.Views.${meta.package.charAt(0).toUpperCase() + meta.package.substr(1)})){
    App.Views.${meta.package.charAt(0).toUpperCase() + meta.package.substr(1)} = {};
}
`);
print(`App.Views.${meta.package.charAt(0).toUpperCase() + meta.package.substr(1)}.${meta.className.charAt(0).toUpperCase() + meta.className.substr(1)} = App.Helpers.View.extend({
    template: App.Templates.${meta.package}${meta.className.charAt(0).toUpperCase() + meta.className.substr(1)},
    className: '${meta.package.charAt(0).toUpperCase() + meta.package.substr(1)}${meta.className.charAt(0).toUpperCase() + meta.className.substr(1)}',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});`);
} else {
print(`App.Views.${meta.className.charAt(0).toUpperCase() + meta.className.substr(1)} = App.Helpers.View.extend({
    template: App.Templates.${meta.className.charAt(0).toUpperCase() + meta.className.substr(1)},
    className: '${meta.className.charAt(0).toUpperCase() + meta.className.substr(1)}',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {
    
    }
});`);
} %>