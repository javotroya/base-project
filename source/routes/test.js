'use strict';
App.Router.Test = App.Helpers.Router.extend({
    className   : 'Test',
    routes      : {}
});

let TestRouter = new App.Router.Test();
TestRouter.on('route', function (actions) {
    if(App.Const.debug){
        console.log( actions );
    }
});