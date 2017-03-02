'use strict';
App.Router.Main = App.Helpers.Router.extend({
    className: 'Main',
    routes   : {
        '': 'landing',
    },
    landing  : function(){
        // Write some awesome landing page here.
    }
});

let MainRouter = new App.Router.Main();
MainRouter.on('route', function(actions){
    if(App.Const.debug){
        console.log(actions);
    }
});
