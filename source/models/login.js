'use strict';
App.Models.Login = App.Helpers.Model.extend({
    url                 : 'auth/login',
    isLogin             : function(){
        let id = this.get('id');
        let sessionData = localStorage.getItem('currentSessionData');
        if(!_.isNull(sessionData)){
            let session = JSON.parse(sessionData);
            for(let key in session){
                if(session.hasOwnProperty(key) &&
                   session[key] !== sessionStorage.getItem(key)){
                    sessionStorage.setItem(key, session[key]);
                }
            }
        }else{
            sessionStorage.clear();
        }
        if(!_.isUndefined(id) && !_.isNull(id)){
            return true;
        }else{
            if(App.loginModel.storage()){
                let accessCollection = new App.Collections.Access();
                if(!_.isUndefined(sessionStorage.getItem('id')) && !_.isNull(sessionStorage.getItem('id'))){
                    App.loginModel.set('id', sessionStorage.getItem('id'));
                    App.loginModel.set('email', sessionStorage.getItem('email'));
                    App.loginModel.set('first', sessionStorage.getItem('first'));
                    App.loginModel.set('last', sessionStorage.getItem('last'));

                    accessCollection.add(JSON.parse(sessionStorage.getItem('acl')));
                    App.loginModel.set('acl', accessCollection);
                    return true;
                }
            }
            return false;
        }
    },
    logout              : function(){
        $.get('auth/logout', {}, function(){
            if(App.loginModel.storage()){
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('email');
                sessionStorage.removeItem('first');
                sessionStorage.removeItem('last');
                sessionStorage.removeItem('acl');
            }
            $.removeCookie('ci_session');
            $.removeCookie('cf_csrf_cookie');
            App.loginModel.clear();
            localStorage.removeItem('currentSessionData');
            localStorage.clear();
            window.location = window.location.origin + '/#';
            window.location.reload();
        });
    },
    storage             : function(){
        return !!(Storage && sessionStorage);
    },
    getFullNameWithEmail: function(){
        let fullName = this.get('last');
        if(!_.isEmpty(this.get('first'))){
            fullName += (!_.isEmpty(fullName) ? ', ' : '') + this.get('first');
        }
        if(!_.isEmpty(this.get('email'))){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + this.get('email');
        }
        return fullName;
    },
    getFullName: function(){
        let fullName = this.get('first');
        if(!_.isEmpty(this.get('first'))){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + this.get('last');
        }
        return fullName;
    },
    hasAccess           : function(id){
        return !_.isUndefined(this._findAccessGroup(id));
    },
    canEdit             : function(id){
        let accessGroup = this._findAccessGroup(id);
        return !_.isUndefined(accessGroup) && accessGroup.get('can_edit') === 1;
    },
    _findAccessGroup    : function(id){
        id = parseInt(id, 10);
        let accessGroup;
        if(App.loginModel.get('acl') instanceof Backbone.Collection){
            accessGroup = _.find(App.loginModel.get('acl').models, function(acl){
                return acl.get('access_group_id') === id;
            });
        }
        return accessGroup;
    },
    updateSessionData   : function(model){
        if(model.email !== sessionStorage.getItem('email')){
            sessionStorage.setItem('email', model.email);
            this.set('email', model.email);
        }
        if(model.first !== sessionStorage.getItem('first')){
            sessionStorage.setItem('first', model.first);
            this.set('first', model.first);
        }
        if(model.middle !== sessionStorage.getItem('middle')){
            sessionStorage.setItem('middle', model.middle);
            this.set('middle', model.middle);
        }
        if(model.last !== sessionStorage.getItem('last')){
            sessionStorage.setItem('last', model.last);
            this.set('last', model.last);
        }
        if(model.phone !== sessionStorage.getItem('phone')){
            sessionStorage.setItem('phone', model.phone);
            this.set('phone', model.phone);
        }
        let currentSession = JSON.stringify(sessionStorage);
        localStorage.setItem('currentSessionData', currentSession);
    }
});
