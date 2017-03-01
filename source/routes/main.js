'use strict';
App.Router.Main = App.Helpers.Router.extend({
    className : 'Main',
    routes    : {
        ''  : 'landing'
    },
    initialize: function(){
        App.Helpers.Router.prototype.initialize.call(this);
        this.token      = '';
        let sessionData = localStorage.getItem('currentSessionData');
        if(!_.isNull(sessionData)){
            let session = JSON.parse(sessionData);
            for(let key in session){
                sessionStorage.setItem(key, session[key]);
            }
        }
    },
    execute   : function(){
        this.beforeEach();
        App.Helpers.Router.prototype.execute.apply(this, arguments);
    },
    beforeEach: function(){
        if(!App.loginModel.isLogin()){
            this._header();
            this._sidebar();
            this._footer();
            this._sidebarControl();
        }else{
            this.login();
        }
        return this;
    },
    _header   : function(){
        if(App.Helpers.checkViewExist('header') === false){
            let header = new App.Views.Base.Header({model: App.loginModel});
            App.Helpers.htmlView(header, '.main-header');
        }
    },
    _sidebar    : function(){
        if(App.Helpers.checkViewExist('main_sidebar') === false){
            let sidebar = new App.Views.Base.MainSidebar({model: App.loginModel});
            App.Helpers.htmlView(sidebar, '.main-sidebar');
            let test = new App.Views.Test.Index();
            App.Helpers.htmlView(test, '.content-wrapper');
        }
    },
    _footer   : function(){
        if(App.Helpers.checkViewExist('footer') === false){
            let footer = new App.Views.Base.Footer({cacheHash: App.CacheHash});
            App.Helpers.htmlView(footer, '.main-footer');
        }
    },
    _sidebarControl   : function(){
        if(App.Helpers.checkViewExist('sidebar_control') === false){
            let sidebarControl = new App.Views.Base.SidebarControl({cacheHash: App.CacheHash});
            App.Helpers.after(sidebarControl, '.main-footer');
        }
    },
    login                        : function(){
        if(App.loginModel.isLogin()){
            Backbone.history.navigate('mysettings', {trigger: true});
        }else{
            let model = App.loginModel;
            let login = new App.Views.Session.Login({model: model});
            App.Helpers.htmlView(login, '#main');
        }
    },
    landing: function(){
        console.log('Hello');
    }
});

