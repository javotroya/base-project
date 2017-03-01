'use strict';
App.Models.Login = App.Helpers.Model.extend({
    url                 : 'api/authentication_controller_master/login',
    isLogin             : function(){
        let id = this.get('id');
        let sessionData = localStorage.getItem('currentSessionData');
        if(!_.isNull(sessionData)){
            let session = JSON.parse(sessionData);
            for(let key in session){
                if(session[key] !== sessionStorage.getItem(key)){
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
                if(!_.isUndefined(sessionStorage.getItem('loginId')) && !_.isNull(sessionStorage.getItem('loginId'))){
                    App.loginModel.set('id', sessionStorage.getItem('loginId'));
                    App.loginModel.set('email', sessionStorage.getItem('email'));
                    App.loginModel.set('first', sessionStorage.getItem('first'));
                    App.loginModel.set('middle', sessionStorage.getItem('middle'));
                    App.loginModel.set('last', sessionStorage.getItem('last'));
                    App.loginModel.set('phone', sessionStorage.getItem('phone'));
                    App.loginModel.set('isDA', parseInt(sessionStorage.getItem('isDA'), 10));
                    App.loginModel.set('isHearingRep', parseInt(sessionStorage.getItem('isHearingRep'), 10));
                    App.loginModel.set('isClientRep', parseInt(sessionStorage.getItem('isClientRep'), 10));
                    App.loginModel.set('popAlerts', parseInt(sessionStorage.getItem('popAlerts'), 10));
                    App.loginModel.set('firm', sessionStorage.getItem('firm'));
                    if(sessionStorage.getItem('settings') !== 'undefined'){
                        App.loginModel.set('settings', JSON.parse(sessionStorage.getItem('settings')));
                    }

                    accessCollection.add(JSON.parse(sessionStorage.getItem('acl')));
                    App.loginModel.set('acl', accessCollection);
                    return true;
                }
            }
            return false;
        }
    },
    logout              : function(){
        $.post('api/authentication_controller_master/logout', {}, function(){
            if(App.loginModel.storage()){
                sessionStorage.removeItem('loginId');
                sessionStorage.removeItem('email');
                sessionStorage.removeItem('first');
                sessionStorage.removeItem('middle');
                sessionStorage.removeItem('last');
                sessionStorage.removeItem('phone');
                sessionStorage.removeItem('acl');
                sessionStorage.removeItem('isDA');
                sessionStorage.removeItem('isClientRep');
                sessionStorage.removeItem('isHearingRep');
                sessionStorage.removeItem('popAlerts');
                sessionStorage.removeItem('firm');
                if(sessionStorage.getItem('settings') !== 'undefined'){
                    sessionStorage.removeItem('settings');
                }
            }
            $.removeCookie('ci_session');
            $.removeCookie('cf_csrf_cookie');
            App.loginModel.clear();
            localStorage.removeItem('currentSessionData');
            localStorage.clear();
            window.location = window.location.origin + '/#sessions/login';
            window.location.reload();
            clearInterval(App.AlertAjax);
            App.AlertAjax = undefined;

        });
    },
    storage             : function(){
        return Storage && sessionStorage ? true : false;
    },
    getFullNameWithEmail: function(){
        let fullName = this.get('last');
        if(!_.isEmpty(this.get('first'))){
            fullName += (!_.isEmpty(fullName) ? ', ' : '') + this.get('first');
        }
        if(!_.isEmpty(this.get('middle'))){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + this.get('middle');
        }
        if(!_.isEmpty(this.get('email'))){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + this.get('email');
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
    },
    getSettingValue    : function(key){
        if(this.get('settings')){
            let setting = _.find(this.get('settings'), function(setting) {
                return setting.key === key;
            });
            return setting.value;
        }else{
            return 1;
        }
    },
    updatePopAlerts    : function(value){
        if(value !== sessionStorage.getItem('popAlerts')){
            sessionStorage.setItem('popAlerts', value);
            this.set('popAlerts', value);
            let currentSession = JSON.stringify(sessionStorage);
            localStorage.setItem('currentSessionData', currentSession);
        }
    },
    updateSettings     : function(value){
        if(value !== sessionStorage.getItem('settings')){
            this.set('settings', value);
            sessionStorage.setItem('settings', JSON.stringify(value));
            let currentSession = JSON.stringify(sessionStorage);
            localStorage.setItem('currentSessionData', currentSession);
        }
    }
});
