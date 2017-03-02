'use strict';

if (_.isUndefined(App.Views.Session)) {
    App.Views.Session = {};
}

App.Views.Session.Login = App.Helpers.View.extend({
    template: App.Templates.sessionLogin,
    className: 'SessionLogin',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {
        'submit form': 'login'
    },
    afterRender: function(){
        this.$el.find('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
    },
    login : function(e){
        e.preventDefault();
        let form = $(e.currentTarget),
            self = this,
            el = self.$el;
        if(!form.valid()){
            return false;
        }
        self.model.set('identity', el.find('[name="identity"]').val());
        self.model.set('password', el.find('[name="password"]').val());
        self.model.set('remember', el.find('[name="remember"]').val());
        self.model.save({}, {
            success: function(){
                if(App.loginModel.storage()){
                    sessionStorage.setItem('id', App.loginModel.get('id'));
                    sessionStorage.setItem('email', (App.loginModel.get('email')) ? App.loginModel.get('email') : '');
                    sessionStorage.setItem('first', (App.loginModel.get('first_name')) ? App.loginModel.get('first_name') : '');
                    sessionStorage.setItem('last', (App.loginModel.get('last_name')) ? App.loginModel.get('last_name') : '');
                    sessionStorage.setItem('acl', JSON.stringify(App.loginModel.get('acl')));
                }
                let accessCollection = new App.Collections.Access();
                accessCollection.add(App.loginModel.get('acl'));
                App.loginModel.set('acl', accessCollection);
                localStorage.setItem('currentSessionData', JSON.stringify(sessionStorage));
                window.location.reload();
            }
        });
    }
});