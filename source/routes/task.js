'use strict';
App.Router.Task = App.Helpers.Router.extend({
    className   : 'Task',
    routes      : {}
});

let TaskRouter = new App.Router.Task();
TaskRouter.on('route', function (actions) {
    if(App.Const.debug){
        console.log( actions );
    }
});