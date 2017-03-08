# Ribs

A complete framework application development using [Codeigniter](https://codeigniter.com/), [BackboneJS](http://backbonejs.org/) & [RivetsJS](http://rivetsjs.com/).

* Clone repository
* Run ```npm install```
* Run ```bower install```
* Setup CodeIgniter's database connection
* Run ```grunt```
* Start development

## Generate BackboneJS components

* ```grunt generate:collection:name_of_collection```
* ```grunt generate:model:name_of_model```
* ```grunt generate:route:name_of_route```
* ```grunt generate:view:name_of_view@path```

### View example

```javascript
'use strict';

if(_.isUndefined(App.Views.Users)){
    App.Views.Users = {};
}

App.Views.Users.Users = App.Helpers.View.extend({
    template            : App.Templates.usersUsers,
    className           : 'users',
    initialize          : function(options){
        App.Helpers.View.prototype.initialize.apply(this, [options]);
        var self = this;
        this.listenTo(this.collection, 'sync error', function(){
            console.log('Error syncing users.');
        });
    },
    afterRender         : function(){
        App.Helpers.initTypeahead({
            view           : this,
            elemClass      : '.typeahead.user_typeahead',
            urlBuild       : {
                url: 'users/search'
            },
            processFunction: $.proxy(this.processUserTypeahead, this)
        });
    },
    processTypeahead : function(datum){
      console.log(datum);
    }
});

```

### Model example
```javascript
'use strict';

App.Models.User = App.Helpers.Model.extend({
    defaults                 : {
        'activated': 0
    },
    url                      : function(){
        if(_.isUndefined(this.id)){
            return 'user';
        }
        return 'user/' + this.id;
    },
    fullName                 : function(){
        if(this.get('first') && this.get('last')){
            return this.get('middle') !== '' ?
                   this.get('first') + ' ' + this.get('middle') + ' ' + this.get('last') :
                   this.get('first') + ' ' + this.get('last');
        }else{
            return '';
        }
    }
});
```
