'use strict';
App.Router.Main = App.Helpers.Router.extend({
    className      : 'Main',
    routes         : {
        ''              : 'landing',
        'session/logout': 'logout',
        'users'         : 'users',
        'recruitment'   : 'recruitment'
    },
    initialize     : function(){
        App.Helpers.Router.prototype.initialize.call(this);
        this.token      = '';
        let sessionData = localStorage.getItem('currentSessionData');
        if(!_.isNull(sessionData)){
            let session = JSON.parse(sessionData);
            for(let key in session){
                if(session.hasOwnProperty(key)){
                    sessionStorage.setItem(key, session[key]);
                }
            }
        }
    },
    execute        : function(){
        this.beforeEach();
        this._persistMenu();
        App.Helpers.Router.prototype.execute.apply(this, arguments);
    },
    beforeEach     : function(){
        if(App.loginModel.isLogin()){
            this._header();
            this._sidebar();
            this._footer();
            this._sidebarControl();
            $('.wrapper').removeClass('hidden');
        }else{
            this._login();
            $('.login-box').removeClass('hidden');
        }
        return this;
    },
    _header        : function(){
        if(App.Helpers.checkViewExist('header') === false){
            let header = new App.Views.Base.Header({model: App.loginModel});
            App.Helpers.htmlView(header, '.main-header');
        }
    },
    _sidebar       : function(){
        if(App.Helpers.checkViewExist('main_sidebar') === false){
            let sidebar = new App.Views.Base.MainSidebar({model: App.loginModel});
            App.Helpers.htmlView(sidebar, '.main-sidebar');
        }
    },
    _footer        : function(){
        if(App.Helpers.checkViewExist('footer') === false){
            let footer = new App.Views.Base.Footer({cacheHash: App.CacheHash});
            App.Helpers.htmlView(footer, '.main-footer');
        }
    },
    _sidebarControl: function(){
        if(App.Helpers.checkViewExist('sidebar_control') === false){
            let sidebarControl = new App.Views.Base.SidebarControl({cacheHash: App.CacheHash});
            App.Helpers.after(sidebarControl, '.main-footer');
        }
    },
    _login         : function(){
        if(App.loginModel.isLogin()){
            Backbone.history.navigate('profile', {trigger: true});
        }else{
            let model = App.loginModel;
            let login = new App.Views.Session.Login({model: model});
            App.Helpers.htmlView(login, '.login-box');
        }
    },
    _persistMenu   : function(){
        let hash     = window.location.hash,
            split    = hash.split('/'),
            parent   = split[0],
            li = $('[href="' + parent + '"]').parent();
        $('.sidebar-menu li').removeClass('active');
        li.addClass('active');
    },
    logout         : function(){
        App.loginModel.logout();
    },
    landing        : function(){
        console.log();
    },
    users: function(){
        console.log(this);
    },
    recruitment: function(){
        console.log(this);
    }
});

