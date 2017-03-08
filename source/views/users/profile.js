'use strict';
if (_.isUndefined(App.Views.Users)) {
    App.Views.Users = {};
}
App.Views.Users.Profile = App.Helpers.View.extend({
    template: App.Templates.usersProfile,
    className: 'UsersProfile',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
        this.user = this.model;
    },
    events: {
        'submit form': 'saveUser'
    },
    saveUser: function(e){
        e.preventDefault();
        let form = $(e.currentTarget),
            data = $.deparam(form.serialize());

        if(!form.valid()){
            return false;
        }

        let button = this.$el.find('[type="submit"]'),
            buttonText = button.html();
        button.html('<span class="fa fa-circle-o-notch fa-spin"></span> Espere...');
        button.attr('disabled', true);
        this.model.set(data);
        this.model.save({},{
            success: function(model, xhr){
                let msg = xhr.message || 'Se guardo el usuario correctamente';
                let toast = new App.Helpers.Toast({message: msg, classType: 'success'});
                toast.render();
            },
            error: function(model, xhr){
                let msg = xhr.responseJSON.message || 'Hubo un error al procesar su solicitud';
                let toast = new App.Helpers.Toast({message: msg, classType: 'danger'});
                toast.render();
            },
            complete: function(){
                button.html(buttonText).removeAttr('disabled');
            }
        });
    },
    getSkillColorClass : function(){
        return `label label-${this.skill.color}`;
    }
});