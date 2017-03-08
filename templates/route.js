'use strict';
App.Router.<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %> = App.Helpers.Router.extend({
    className   : '<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %>',
    routes      : {}
});

let <%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %>Router = new App.Router.<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %>();
<%= meta.className.charAt(0).toUpperCase() + meta.className.substr(1) %>Router.on('route', function (actions) {
    if(App.Const.debug){
        console.log( actions );
    }
});