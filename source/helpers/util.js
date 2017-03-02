'use strict';

//DO NOT USE ECMA6 syntax on this file as this file is not complied with babel. 




App.Helpers.Casefriend    = {};
//var Uit = {};
App.Helpers.initTypeahead = function(params){
    /*
     * Initialize typeahead depending on paramerts passed in
     * @param {Backbone.View} - view, view containing specific view that wrap the typeahead
     * @param {String} - elemClass, class containing specific typeahead class
     * @param {Object} - urlBuild, contains url to specific typehead and a resource if needed
     * @param {Function} - processFunction -  optional function to process when the input matches a suggestion
     * @param {Array} - attributesToMatch - an array containing the names of the attributes that need to be checked in order to decide if there is matched suggestion
     * @param {Boolean} - cleanValueAfterEnter - an boolean that can to allow empty the input when is clicked
     */
    var el                                               = params.view.$el,
        elemClass                                        = params.elemClass || '',
        urlBuild                                         = params.urlBuild || '',
        processFunction                                  = params.processFunction || function(){
            },
        cleanValueAfterEnter                             = params.cleanValueAfterEnter || false,
        displayKey                                       = params.displayKey || App.Helpers.handlerDisplayKey,
        nameKey                                          = params.nameKey || 'last',
        queryOffset = 0, fetch = true, globalSuggestions = [], mainQuery;

    var remote = {
        limit    : App.Const.limitTypeahead,
        cache    : false,
        url      : _.isString(urlBuild) ? urlBuild : _.isObject(urlBuild) && !_.isUndefined(urlBuild.url) ? urlBuild.url : '',
        searchAll: false,
        urlBuild : urlBuild,
        replace  : function(url, query){
            query                = this.searchAll || _.isEmpty(query) ? '*.*' : encodeURIComponent(query);
            this.searchAll       = false;
            var replacedUrl      = url,
                extraQueryParams = '';

            if(_.isObject(this.urlBuild)){
                replacedUrl += '/';

                if(this.urlBuild.resource){
                    replacedUrl += (_.isFunction(this.urlBuild.resource)) ? this.urlBuild.resource() : this.urlBuild.resource;
                }

                if(this.urlBuild.extraQuery && this.urlBuild.extraQuery()){
                    extraQueryParams = '&' + this.urlBuild.extraQuery();
                }
            }

            replacedUrl += '?search=' + query + extraQueryParams;
            replacedUrl += '&offset=' + queryOffset;
            mainQuery = query;
            return replacedUrl;
        },
        ajax     : {
            complete: function(response){
                response = response.responseJSON || [];
                if(response.length > 0){
                    $.each(response, function(i, row){
                        globalSuggestions.push(row);
                    });
                    var typeahead   = el.find(elemClass + '.tt-input'),
                        placeHolder = !_.isEmpty(typeahead.attr('placeholder')) ? typeahead.attr('placeholder') : typeahead.data('placeholder');
                    // Handler to save temporarily the placeholder if that exist and if does open the dropdown.
                    // This placement will append when were is closed the dropdown.
                    if(_.isEmpty(typeahead.typeahead('val')) && el.find(elemClass + '.tt-input ~ .tt-dropdown-menu').is(':visible')){
                        typeahead.attr('placeholder', '');
                        typeahead.data('placeholder', placeHolder);
                    }
                    $('body').css('overflow', 'hidden');
                }
                if(!_.isUndefined(el.find(elemClass + '.tt-input').data('ttTypeahead'))){
                    el.find(elemClass + '.tt-input').data('ttTypeahead').minLength = 1;
                }

                if(!_.isUndefined(el.find(elemClass).parent().next())){
                    if(el.find(elemClass).parent().next().hasClass('icon-typeahead-down')){
                        var chevron = '<i class="fa fa-chevron-down"></i>';
                        el.find(elemClass).parent().next().html(chevron);
                    }
                }

                if($(elemClass + ' ~ .tt-dropdown-menu').is(':off-bottom')){
                    $(elemClass + ' ~ .tt-dropdown-menu').css({
                        'bottom': '100%',
                        'top'   : ''
                    });
                }
            }
        }
    };
    var engine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote        : remote,
        limit         : App.Const.limitTypeahead,
        rateLimitWait : 100
    });

    engine.initialize();
    el.find(elemClass).typeahead('destroy');
    var data = el.find(elemClass).typeahead(
        {
            minLength: 1,
            highlight: true
        },
        {
            name      : 'name',
            displayKey: displayKey,
            nameKey   : nameKey,
            source    : engine.ttAdapter(),
            dynamic   : true,
            delay     : 500
        }
    );

    el.find(elemClass).data('engine', engine);

    data.off('typeahead:selected typeahead:autocompleted');
    data.on('typeahead:selected typeahead:autocompleted typeahead:change', function(obj, datum){
        if(!_.isUndefined(datum)){
            el.find('.tt-dropdown-menu').css('display', 'none');
            el.find(elemClass + '.tt-input').data('ttTypeahead').minLength = 1;
            el.find(elemClass).data('datum', datum);
            mainQuery   = undefined;
            queryOffset = 0;
            fetch       = true;
            $('body').css('overflow', 'auto');
            if(!_.isUndefined(processFunction)){
                processFunction(datum);
            }
        }
    });

    data.off('typeahead:closed');
    data.on('typeahead:closed', function(){
        // handler to restore the placeholder removed temporarily when is closed the dropdown
        // by the currenttypeahead opened.
        var placeholder = el.find(elemClass + '.tt-input').data('placeholder');
        if(!_.isUndefined(placeholder)){
            el.find(elemClass + '.tt-input').attr('placeholder', placeholder);
        }
        mainQuery         = undefined;
        queryOffset       = 0;
        globalSuggestions = [];
        fetch             = true;
        $('body').css('overflow', 'auto');
        $(elemClass + ' ~ .tt-dropdown-menu').css({
            'overflow-y': 'auto',
            'bottom'    : '',
            'top'       : '100%'
        });
    });
    data.bind('keydown', function(evt){
        if(evt.which === 27){
            evt.preventDefault();
            evt.stopPropagation();
            return;
        }
    });
    data.keypress(function(e){
        queryOffset = 0;
        if(e.which === 13){// enter
            e.preventDefault();
            var datum = el.find('.tt-suggestion').data('ttDatum');
            if(_.isUndefined(datum)){
                return;
            }
            data.trigger('typeahead:selected', [datum]);
            if(cleanValueAfterEnter){
                el.find(elemClass).typeahead('val', '');
            }else{
                el.find(elemClass).typeahead('val', displayKey(datum));
            }

            if(el.find(elemClass + '.tt-input').data('ttTypeahead')){
                el.find(elemClass + '.tt-input').data('ttTypeahead').minLength = 0;
            }
        }

    });

    function async(suggestions){
        suggestions    = suggestions || [];
        var elemDDMenu = el.find(elemClass + ' ~ .tt-dropdown-menu');
        if(suggestions.length){
            $.each(suggestions, function(i, row){
                globalSuggestions.push(row);
            });
            globalSuggestions = _.uniq(globalSuggestions);
            var dataset       = el.find(elemClass + '.tt-input').data('ttTypeahead').dropdown.datasets['0'];
            dataset._render(mainQuery, globalSuggestions);
            fetch = true;
        }else{
            fetch = false;
        }
        el.find('#tt-spin-loader').remove();
        elemDDMenu.css('overflow-y', 'auto');
    }

    el.find(elemClass).data('datum', {});
    el.find(elemClass + ' ~ .tt-dropdown-menu').on('scroll', function(){
        var elemDDMenu = $(this);
        if(elemDDMenu.scrollTop() + elemDDMenu.innerHeight() >= elemDDMenu[0].scrollHeight){
            if(fetch){
                var suggestions = elemDDMenu.find('.tt-dataset-name > .tt-suggestions');
                if(el.find('#tt-spin-loader').length){
                    elemDDMenu.css('overflow-y', 'hidden');
                }else{
                    suggestions
                        .append('<div id="tt-spin-loader" class="tt-suggestion t-align-center"><span class="fa fa-circle-o-notch fa-spin"></span></div>');
                    queryOffset += App.Const.likeSearchOffset;
                }
                engine.get(mainQuery, async);
            }else{
                queryOffset = 0;
            }
        }
    });

    return data;
};

App.Helpers.initSelect2 = function(elem, options){
    elem.select2(options);
};

App.Helpers.showAllEntities = function(e, el){
    var element   = $(e.currentTarget),
        typeahead = el.find('input[name=' + element.data('input-name') + ']'),
        engine    = typeahead.data('engine'),
        ev        = $.Event('keydown');

    if(!_.isUndefined(typeahead.data('ttTypeahead'))){
        typeahead.data('ttTypeahead').minLength = 0;
    }

    if(!_.isUndefined(engine)){
        engine.remote.searchAll = true;
    }
    ev.keyCode = ev.which = 40;
    typeahead.focus();
    typeahead.trigger(ev);
};

App.Helpers.handlerDisplayKey = function(obj){
    if(_.size(obj) === 0){
        return '';
    }
    return obj.typeaheadResult;
};

App.Helpers.Toast = Uit.View.extend({
    initialize        : function(options){
        this.options           = options || {};
        this.options.message   = this.options.message || '';
        this.options.classType = this.options.classType || 'danger';
        this.options.fadeOut   = this.options.fadeOut || 4000;
    },
    render            : function(){
        var template = _.template(['<div class="toast alert alert-<%= classType %>" role="alert">',
                                   '<span class="pull-left">',
                                   '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span></span>',
                                   '<p><%= message %></p>',
                                   '</div>'].join(''));
        this.$el.html(template(this.options));

        this.$el.css({
            'z-index' : 1050,
            'position': 'relative'
        });

        this._removeWhenClicked();
        $('body').append(this.el);
        this.fadeOut(this.options.fadeOut);
        return this;
    },
    fadeOut           : function(fadeOutTime){
        fadeOutTime = fadeOutTime || 4000;
        this.$el.fadeOut(fadeOutTime, function(){
            $(this).remove();
        });
    },
    _removeWhenClicked: function(){
        this.$el.find('.toast').on('click', function(){
            $(this).remove();
        });
    }
});

// //override backbone delete to be able to send parameters.
var oldBackboneSync = Backbone.sync;
Backbone.sync       = function(method, model, options){
    var beforeSend = options.beforeSend;

    options.beforeSend = function(){
        if(beforeSend){
            return beforeSend.apply(this, arguments);
        }
    };
    if(method === 'delete'){
        if(options.data){
            // properly formats data for back-end to parse
            options.data = JSON.stringify(options.data);
        }
        // transform all delete requests to application/json
        options.contentType = 'application/json';
    }
    return oldBackboneSync.apply(this, [method, model, options]);
};


App.Helpers.splitPersonName = function(personName){
    var splitName = personName.replace(/\s+/g, ' ').trim().split(' ');
    var result    = {first: '', middle: '', last: ''};
    result.first  = splitName[0];
    if(splitName.length === 3){
        result.middle = splitName[1];
        result.last   = splitName[2];
    }else if(splitName.length === 2){
        result.middle = '';
        result.last   = splitName[1];
    }else if(splitName.length > 3){
        for(var i = 1; i < splitName.length - 1; i++){
            result.middle += ' ' + splitName[i];
        }
        result.last = splitName[splitName.length - 1];
    }
    result.middle = String(result.middle).trim();
    return result;
};

App.Helpers.getStateSelect = function(){
    return '<option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option>';
};

App.Helpers.getTimezoneSelect = function(){
    return '<option value="Pacific/Midway">Pacific/Midway (-11:00:00)</option><option value="Pacific/Samoa">Pacific/Samoa (-11:00:00)</option><option value="Pacific/Pago_Pago">Pacific/Pago_Pago (-11:00:00)</option><option value="Pacific/Niue">Pacific/Niue (-11:00:00)</option><option value="Pacific/Rarotonga">Pacific/Rarotonga (-10:00:00)</option><option value="America/Adak">America/Adak (-10:00:00)</option><option value="America/Atka">America/Atka (-10:00:00)</option><option value="Pacific/Honolulu">Pacific/Honolulu (-10:00:00)</option><option value="Pacific/Tahiti">Pacific/Tahiti (-10:00:00)</option><option value="Pacific/Johnston">Pacific/Johnston (-10:00:00)</option><option value="Pacific/Marquesas">Pacific/Marquesas (-09:30:00)</option><option value="Pacific/Gambier">Pacific/Gambier (-09:00:00)</option><option value="America/Nome">America/Nome (-09:00:00)</option><option value="America/Juneau">America/Juneau (-09:00:00)</option><option value="America/Sitka">America/Sitka (-09:00:00)</option><option value="America/Metlakatla">America/Metlakatla (-09:00:00)</option><option value="America/Anchorage">America/Anchorage (-09:00:00)</option><option value="America/Yakutat">America/Yakutat (-09:00:00)</option><option value="Pacific/Pitcairn">Pacific/Pitcairn (-08:00:00)</option><option value="America/Dawson">America/Dawson (-08:00:00)</option><option value="America/Ensenada">America/Ensenada (-08:00:00)</option><option value="America/Tijuana">America/Tijuana (-08:00:00)</option><option value="America/Whitehorse">America/Whitehorse (-08:00:00)</option><option value="America/Vancouver">America/Vancouver (-08:00:00)</option><option value="America/Santa_Isabel">America/Santa_Isabel (-08:00:00)</option><option value="America/Los_Angeles">America/Los_Angeles (-08:00:00)</option><option value="America/Yellowknife">America/Yellowknife (-07:00:00)</option><option value="America/Hermosillo">America/Hermosillo (-07:00:00)</option><option value="America/Denver">America/Denver (-07:00:00)</option><option value="America/Shiprock">America/Shiprock (-07:00:00)</option><option value="America/Phoenix">America/Phoenix (-07:00:00)</option><option value="America/Ojinaga">America/Ojinaga (-07:00:00)</option><option value="America/Boise">America/Boise (-07:00:00)</option><option value="America/Cambridge_Bay">America/Cambridge_Bay (-07:00:00)</option><option value="America/Mazatlan">America/Mazatlan (-07:00:00)</option><option value="America/Chihuahua">America/Chihuahua (-07:00:00)</option><option value="America/Creston">America/Creston (-07:00:00)</option><option value="America/Dawson_Creek">America/Dawson_Creek (-07:00:00)</option><option value="America/Inuvik">America/Inuvik (-07:00:00)</option><option value="America/Edmonton">America/Edmonton (-07:00:00)</option><option value="America/Fort_Nelson">America/Fort_Nelson (-07:00:00)</option><option value="America/Monterrey">America/Monterrey (-06:00:00)</option><option value="America/Mexico_City">America/Mexico_City (-06:00:00)</option><option value="America/Indiana/Knox">America/Indiana/Knox (-06:00:00)</option><option value="America/Swift_Current">America/Swift_Current (-06:00:00)</option><option value="America/Tegucigalpa">America/Tegucigalpa (-06:00:00)</option><option value="America/Bahia_Banderas">America/Bahia_Banderas (-06:00:00)</option><option value="America/Merida">America/Merida (-06:00:00)</option><option value="America/El_Salvador">America/El_Salvador (-06:00:00)</option><option value="America/Menominee">America/Menominee (-06:00:00)</option><option value="America/Costa_Rica">America/Costa_Rica (-06:00:00)</option><option value="America/Matamoros">America/Matamoros (-06:00:00)</option><option value="America/Guatemala">America/Guatemala (-06:00:00)</option><option value="America/Knox_IN">America/Knox_IN (-06:00:00)</option><option value="America/Managua">America/Managua (-06:00:00)</option><option value="America/Indiana/Tell_City">America/Indiana/Tell_City (-06:00:00)</option><option value="America/Winnipeg">America/Winnipeg (-06:00:00)</option><option value="America/Resolute">America/Resolute (-06:00:00)</option><option value="America/Regina">America/Regina (-06:00:00)</option><option value="America/North_Dakota/New_Salem">America/North_Dakota/New_Salem (-06:00:00)</option><option value="Pacific/Galapagos">Pacific/Galapagos (-06:00:00)</option><option value="America/North_Dakota/Center">America/North_Dakota/Center (-06:00:00)</option><option value="America/Chicago">America/Chicago (-06:00:00)</option><option value="America/North_Dakota/Beulah">America/North_Dakota/Beulah (-06:00:00)</option><option value="America/Rainy_River">America/Rainy_River (-06:00:00)</option><option value="America/Rankin_Inlet">America/Rankin_Inlet (-06:00:00)</option><option value="America/Belize">America/Belize (-06:00:00)</option><option value="America/Nipigon">America/Nipigon (-05:00:00)</option><option value="America/Bogota">America/Bogota (-05:00:00)</option><option value="America/Cancun">America/Cancun (-05:00:00)</option><option value="America/Cayman">America/Cayman (-05:00:00)</option><option value="America/Eirunepe">America/Eirunepe (-05:00:00)</option><option value="America/Atikokan">America/Atikokan (-05:00:00)</option><option value="America/Coral_Harbour">America/Coral_Harbour (-05:00:00)</option><option value="America/Guayaquil">America/Guayaquil (-05:00:00)</option><option value="America/Detroit">America/Detroit (-05:00:00)</option><option value="America/Indiana/Marengo">America/Indiana/Marengo (-05:00:00)</option><option value="America/Indiana/Petersburg">America/Indiana/Petersburg (-05:00:00)</option><option value="America/Indiana/Vevay">America/Indiana/Vevay (-05:00:00)</option><option value="America/Indiana/Vincennes">America/Indiana/Vincennes (-05:00:00)</option><option value="America/Indiana/Winamac">America/Indiana/Winamac (-05:00:00)</option><option value="America/Indiana/Indianapolis">America/Indiana/Indianapolis (-05:00:00)</option><option value="America/Iqaluit">America/Iqaluit (-05:00:00)</option><option value="America/Havana">America/Havana (-05:00:00)</option><option value="America/Kentucky/Monticello">America/Kentucky/Monticello (-05:00:00)</option><option value="America/Kentucky/Louisville">America/Kentucky/Louisville (-05:00:00)</option><option value="America/Lima">America/Lima (-05:00:00)</option><option value="America/Fort_Wayne">America/Fort_Wayne (-05:00:00)</option><option value="America/Indianapolis">America/Indianapolis (-05:00:00)</option><option value="America/Jamaica">America/Jamaica (-05:00:00)</option><option value="America/Louisville">America/Louisville (-05:00:00)</option><option value="America/New_York">America/New_York (-05:00:00)</option><option value="America/Nassau">America/Nassau (-05:00:00)</option><option value="America/Montreal">America/Montreal (-05:00:00)</option><option value="America/Toronto">America/Toronto (-05:00:00)</option><option value="America/Panama">America/Panama (-05:00:00)</option><option value="America/Pangnirtung">America/Pangnirtung (-05:00:00)</option><option value="America/Port-au-Prince">America/Port-au-Prince (-05:00:00)</option><option value="America/Porto_Acre">America/Porto_Acre (-05:00:00)</option><option value="America/Rio_Branco">America/Rio_Branco (-05:00:00)</option><option value="America/Thunder_Bay">America/Thunder_Bay (-05:00:00)</option><option value="Pacific/Easter">Pacific/Easter (-05:00:00)</option><option value="America/Lower_Princes">America/Lower_Princes (-04:00:00)</option><option value="America/St_Kitts">America/St_Kitts (-04:00:00)</option><option value="America/Blanc-Sablon">America/Blanc-Sablon (-04:00:00)</option><option value="America/Dominica">America/Dominica (-04:00:00)</option><option value="America/Guadeloupe">America/Guadeloupe (-04:00:00)</option><option value="America/Santo_Domingo">America/Santo_Domingo (-04:00:00)</option><option value="America/Guyana">America/Guyana (-04:00:00)</option><option value="America/Porto_Velho">America/Porto_Velho (-04:00:00)</option><option value="America/Anguilla">America/Anguilla (-04:00:00)</option><option value="America/Grenada">America/Grenada (-04:00:00)</option><option value="America/Glace_Bay">America/Glace_Bay (-04:00:00)</option><option value="America/Halifax">America/Halifax (-04:00:00)</option><option value="America/Virgin">America/Virgin (-04:00:00)</option><option value="America/Barbados">America/Barbados (-04:00:00)</option><option value="America/Martinique">America/Martinique (-04:00:00)</option><option value="America/Thule">America/Thule (-04:00:00)</option><option value="America/St_Lucia">America/St_Lucia (-04:00:00)</option><option value="America/Manaus">America/Manaus (-04:00:00)</option><option value="America/La_Paz">America/La_Paz (-04:00:00)</option><option value="America/Tortola">America/Tortola (-04:00:00)</option><option value="America/Moncton">America/Moncton (-04:00:00)</option><option value="America/Caracas">America/Caracas (-04:00:00)</option><option value="America/St_Vincent">America/St_Vincent (-04:00:00)</option><option value="America/Grand_Turk">America/Grand_Turk (-04:00:00)</option><option value="America/Kralendijk">America/Kralendijk (-04:00:00)</option><option value="America/Curacao">America/Curacao (-04:00:00)</option><option value="America/Goose_Bay">America/Goose_Bay (-04:00:00)</option><option value="America/Aruba">America/Aruba (-04:00:00)</option><option value="America/St_Thomas">America/St_Thomas (-04:00:00)</option><option value="America/Campo_Grande">America/Campo_Grande (-04:00:00)</option><option value="America/St_Barthelemy">America/St_Barthelemy (-04:00:00)</option><option value="America/Puerto_Rico">America/Puerto_Rico (-04:00:00)</option><option value="America/Port_of_Spain">America/Port_of_Spain (-04:00:00)</option><option value="America/Antigua">America/Antigua (-04:00:00)</option><option value="America/Montserrat">America/Montserrat (-04:00:00)</option><option value="America/Boa_Vista">America/Boa_Vista (-04:00:00)</option><option value="America/Cuiaba">America/Cuiaba (-04:00:00)</option><option value="America/Marigot">America/Marigot (-04:00:00)</option><option value="America/St_Johns">America/St_Johns (-03:30:00)</option><option value="America/Catamarca">America/Catamarca (-03:00:00)</option><option value="America/Maceio">America/Maceio (-03:00:00)</option><option value="America/Buenos_Aires">America/Buenos_Aires (-03:00:00)</option><option value="America/Cayenne">America/Cayenne (-03:00:00)</option><option value="America/Miquelon">America/Miquelon (-03:00:00)</option><option value="America/Montevideo">America/Montevideo (-03:00:00)</option><option value="America/Argentina/San_Juan">America/Argentina/San_Juan (-03:00:00)</option><option value="America/Argentina/Salta">America/Argentina/Salta (-03:00:00)</option><option value="America/Santiago">America/Santiago (-03:00:00)</option><option value="America/Paramaribo">America/Paramaribo (-03:00:00)</option><option value="America/Argentina/Rio_Gallegos">America/Argentina/Rio_Gallegos (-03:00:00)</option><option value="America/Argentina/La_Rioja">America/Argentina/La_Rioja (-03:00:00)</option><option value="America/Araguaina">America/Araguaina (-03:00:00)</option><option value="America/Belem">America/Belem (-03:00:00)</option><option value="America/Santarem">America/Santarem (-03:00:00)</option><option value="America/Sao_Paulo">America/Sao_Paulo (-03:00:00)</option><option value="America/Bahia">America/Bahia (-03:00:00)</option><option value="America/Recife">America/Recife (-03:00:00)</option><option value="America/Asuncion">America/Asuncion (-03:00:00)</option><option value="America/Argentina/Mendoza">America/Argentina/Mendoza (-03:00:00)</option><option value="America/Argentina/Jujuy">America/Argentina/Jujuy (-03:00:00)</option><option value="America/Argentina/Cordoba">America/Argentina/Cordoba (-03:00:00)</option><option value="America/Argentina/ComodRivadavia">America/Argentina/ComodRivadavia (-03:00:00)</option><option value="America/Godthab">America/Godthab (-03:00:00)</option><option value="America/Argentina/Catamarca">America/Argentina/Catamarca (-03:00:00)</option><option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires (-03:00:00)</option><option value="America/Fortaleza">America/Fortaleza (-03:00:00)</option><option value="America/Argentina/Ushuaia">America/Argentina/Ushuaia (-03:00:00)</option><option value="America/Argentina/Tucuman">America/Argentina/Tucuman (-03:00:00)</option><option value="America/Argentina/San_Luis">America/Argentina/San_Luis (-03:00:00)</option><option value="America/Mendoza">America/Mendoza (-03:00:00)</option><option value="America/Rosario">America/Rosario (-03:00:00)</option><option value="America/Cordoba">America/Cordoba (-03:00:00)</option><option value="America/Jujuy">America/Jujuy (-03:00:00)</option><option value="America/Noronha">America/Noronha (-02:00:00)</option><option value="America/Scoresbysund">America/Scoresbysund (-01:00:00)</option><option value="America/Danmarkshavn">America/Danmarkshavn (00:00:00)</option><option value="Pacific/Palau">Pacific/Palau (09:00:00)</option><option value="Pacific/Yap">Pacific/Yap (10:00:00)</option><option value="Pacific/Truk">Pacific/Truk (10:00:00)</option><option value="Pacific/Chuuk">Pacific/Chuuk (10:00:00)</option><option value="Pacific/Port_Moresby">Pacific/Port_Moresby (10:00:00)</option><option value="Pacific/Saipan">Pacific/Saipan (10:00:00)</option><option value="Pacific/Guam">Pacific/Guam (10:00:00)</option><option value="Pacific/Guadalcanal">Pacific/Guadalcanal (11:00:00)</option><option value="Pacific/Kosrae">Pacific/Kosrae (11:00:00)</option><option value="Pacific/Norfolk">Pacific/Norfolk (11:00:00)</option><option value="Pacific/Pohnpei">Pacific/Pohnpei (11:00:00)</option><option value="Pacific/Noumea">Pacific/Noumea (11:00:00)</option><option value="Pacific/Ponape">Pacific/Ponape (11:00:00)</option><option value="Pacific/Bougainville">Pacific/Bougainville (11:00:00)</option><option value="Pacific/Efate">Pacific/Efate (11:00:00)</option><option value="Pacific/Funafuti">Pacific/Funafuti (12:00:00)</option><option value="Pacific/Nauru">Pacific/Nauru (12:00:00)</option><option value="Pacific/Majuro">Pacific/Majuro (12:00:00)</option><option value="Pacific/Tarawa">Pacific/Tarawa (12:00:00)</option><option value="Pacific/Kwajalein">Pacific/Kwajalein (12:00:00)</option><option value="Pacific/Wake">Pacific/Wake (12:00:00)</option><option value="Pacific/Fiji">Pacific/Fiji (12:00:00)</option><option value="Pacific/Wallis">Pacific/Wallis (12:00:00)</option><option value="Pacific/Tongatapu">Pacific/Tongatapu (13:00:00)</option><option value="Pacific/Fakaofo">Pacific/Fakaofo (13:00:00)</option><option value="Pacific/Auckland">Pacific/Auckland (13:00:00)</option><option value="Pacific/Enderbury">Pacific/Enderbury (13:00:00)</option><option value="Pacific/Chatham">Pacific/Chatham (13:45:00)</option><option value="Pacific/Apia">Pacific/Apia (14:00:00)</option><option value="Pacific/Kiritimati">Pacific/Kiritimati (14:00:00)</option>';
};

App.Helpers.getStateName = function(stateModel, nameArr){
    var stateName = '';
    var states    = App.Helpers.getStateSelect();
    var stateId   = '';
    _.each(nameArr, function(modelAttributeName){
        stateId = stateModel.get(modelAttributeName);
        if(stateId){
            var regularFindOption = new RegExp('<option value\=\"' + stateId + '\">(.*?)<\/option>', 'g');
            var cleanName         = new RegExp('<option value\=\"' + stateId + '\">', 'g');
            var result            = states.match(regularFindOption).map(function(val){
                var clean = val.replace(cleanName, '');
                return clean.replace(/<\/?option>/g, '');
            });
            stateName             = result[0];
        }else{
            stateName = '';
        }
        stateModel.set(modelAttributeName + 'Name', stateName);
    });
};

App.Helpers.CurrencyFormat = function(amount, returnEmptyNull){
    if(amount){
        amount = parseFloat(amount);
        return amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }else if(returnEmptyNull && (_.isNull(amount) || amount === '')){
        return '';
    }else{
        return '0.00';
    }
};

App.Helpers.IntegerWithCommas = function(amount){
    if(amount){
        amount = parseInt(amount, 10);
        return amount.toLocaleString('en');
    }
    return false;
};

App.Helpers.FormatterHtml = function(value){
    var textarea = $('<textarea>' + value + '</textarea>');
    return textarea.val().replace(/\r\n|\r|\n/g, '<br /> ');
};

App.Helpers.replaceSpecialCharaters = function(str, checkEncodeURIComponent){
    checkEncodeURIComponent = _.isUndefined(checkEncodeURIComponent) ? true : checkEncodeURIComponent;
    str                     = str || '';
    if(checkEncodeURIComponent){
        str = encodeURIComponent(str);
    }
    return str.replace(/[!'()*]/g, function(char){
        return '%' + char.charCodeAt(0).toString(16);
    });
};

//this function supports as parameters a regular object or a Backbone.Model object.
App.Helpers.TypeaheadFormatter = function(obj){
    if(_.size(obj) === 0){
        return '';
    }

    if(obj instanceof Backbone.Model){//if backbone model object
        if(!_.isUndefined(obj.get('first'))){
            obj.first  = obj.get('first');
            obj.last   = obj.get('last');
            obj.middle = obj.get('middle');
            obj.email  = obj.get('email');
        }

        if(!_.isUndefined(obj.get('doctorFirstName'))){
            obj.first           = obj.get('doctorFirstName');
            obj.last            = obj.get('doctorLastName');
            obj.middle          = obj.get('doctorMiddleName');
            obj.email           = obj.get('doctorEmail');
            obj.physicalAddress = obj.get('physicalAddress');
            obj.physicalCity    = obj.get('physicalCity');
        }
    }


    if(obj.companyName){
        return obj.companyName + (!_.isUndefined(obj.companyTypeName) ? ':' + obj.companyTypeName : '');
    }else if(obj.clientName){
        var clientTypeName = '';
        if(obj.clientTypeID === 2){
            clientTypeName = 'Insurer';
        }else if(obj.clientTypeID === 3){
            clientTypeName = 'TPA';
        }
        return obj.clientName + ':' + clientTypeName;
    }else if(obj.firmName){
        return obj.firmName;
    }else if(obj.venueName){
        var venue = obj.venueName;
        if(obj.venueAbbrev){
            venue += ', ' + obj.venueAbbrev;
        }
        return venue;
    }else if(obj.eventTypeName){
        if(!_.isUndefined(obj.description) && !_.isEmpty(obj.description)){
            return obj.eventTypeName + ': ' + obj.description;
        }else{
            return obj.eventTypeName;
        }
    }else if(obj.eventTitle){
        if(!_.isUndefined(obj.shortNote) && !_.isEmpty(obj.shortNote)){
            return obj.eventTitle + ': ' + obj.shortNote;
        }else{
            return obj.eventTitle;
        }
    }else if(obj.firmName){
        return obj.firmName;
    }else if(obj.ClaimantName){
        return obj.ClaimantName;
    }else if(obj.facilityName){
        return obj.facilityName;
    }else if(obj.payeeName){
        return obj.payeeName;
    }else if(obj.fileTitle){
        return obj.fileTitle;
    }else{
        var fullName = '';
        obj.last     = obj.last || '';
        obj.first    = obj.first || '';
        obj.middle   = obj.middle || '';
        obj.email    = obj.email || '';

        fullName = obj.last;
        if(!_.isEmpty(obj.first)){
            fullName += (!_.isEmpty(fullName) ? ', ' : '') + obj.first;
        }

        if(!_.isEmpty(obj.middle)){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + obj.middle;
        }

        if(!_.isEmpty(obj.email)){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + obj.email;
        }

        if(obj.physicalAddress && !_.isEmpty(obj.physicalAddress)){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + obj.physicalAddress;
        }

        if(obj.physicalCity && !_.isEmpty(obj.physicalCity)){
            fullName += (!_.isEmpty(fullName) ? ' ' : '') + obj.physicalCity;
        }
        return fullName;
    }
};


App.Helpers.View = Uit.View.extend({
    initialize              : function(options){
        Uit.View.prototype.initialize.apply(this, [options]);
        this.setupValidationMessages();
    },
    render                  : function(slideDown){
        var template       = $(this.template());
        var stateHelper    = template.find('.state-helper');
        var timezoneHelper = template.find('.timezone-helper');
        _.each(stateHelper, function(elem){
            elem = $(elem);
            elem.append(App.Helpers.getStateSelect());
        });
        _.each(timezoneHelper, function(elem){
            elem = $(elem);
            elem.append(App.Helpers.getTimezoneSelect());
        });
        if(slideDown){
            this.$el.html(template).hide().slideDown(666);
        }else{
            this.$el.html(template);
        }

        return this;
    },
    handlerTooltip          : function(){
        this.cacheTooltip = [];

        this.$el.find('.control-tooltip').on('hide.bs.tooltip', $.proxy(function(e){
            var element        = $(e.currentTarget),
                elementTooltip = $('#' + element.attr('aria-describedby'));

            elementTooltip.find('.tooltip-inner').removeAttr('style');
            elementTooltip.find('.tooltip-inner').resizable('destroy');
            elementTooltip.draggable('destroy');
        }, this));

        this.$el.find('.control-tooltip').on('shown.bs.tooltip', $.proxy(function(e){
            var element        = $(e.currentTarget),
                elementTooltip = $('#' + element.attr('aria-describedby'));

            elementTooltip.find('.btn-close').on('click', function(event){
                var tooltipId = $(event.currentTarget).closest('.tooltip').attr('id');
                $('[aria-describedby=' + tooltipId + ']').tooltip('toggle');
            });

            elementTooltip.find('.help-body').css('height', elementTooltip.find('.help-body').data('default-height'));
            elementTooltip.find('.tooltip-inner').resizable();

            elementTooltip.draggable({
                handle     : '.title',
                containment: 'html',
                cancel     : '.btn-close'
            });
        }, this));


        if(!_.isUndefined(this.options.parentViewClassName) && !_.isUndefined($('.' + this.options.parentViewClassName).data('view'))){
            var parentView = $('.' + this.options.parentViewClassName).data('view');

            if(!parentView.events['click .control-tooltip']){
                _.extend(this.events, {
                    'click .control-tooltip': '_handlerMouseOverTooltip',
                });
                this.delegateEvents(this.events);
            }
        }else{
            _.extend(this.events, {
                'click .control-tooltip': '_handlerMouseOverTooltip',
            });
            this.delegateEvents(this.events);
        }
    },
    _handlerMouseOverTooltip: function(e){
        var element = $(e.currentTarget),
            that    = this,
            helpID  = element.data('help-id'),
            dataTooltip;

        dataTooltip = _.find(this.cacheTooltip, {helpID: helpID});

        var link_custom_tooltip = $('link#custom_tooltip').clone();
        $('link#custom_tooltip').remove();
        link_custom_tooltip.appendTo('head');

        if(_.isUndefined(dataTooltip)){
            this.showLoader();

            $.get('/api/help_controller/getHelp/' + helpID)
                .done(function(response){
                    if(_.size(response) > 0){
                        that.cacheTooltip.push(response);
                        that._initializeTooltip(element, response);
                        element.tooltip('toggle');
                    }
                })
                .always(function(){
                    that.removeLoader();
                });
        }else{
            if(element.attr('tooltip-initialized')){
                element.tooltip('toggle');
            }else{
                this._initializeTooltip(element, dataTooltip);
                element.tooltip('toggle');
            }
        }
    },
    _prepareFrameHtml       : function(element, url){
        var width  = element.data('width') || 300,
            height = element.data('height') || 200;

        return '<iframe width="' + width + '" height="' + height + '" src="' + url + '" frameborder="0"></iframe>';
    },
    _initializeTooltip      : function(element, dataTooltip){
        var content       = '',
            defaultWidth  = 400, //px
            defaultHeight = 'auto';

        if(_.size(dataTooltip) === 0){
            return;
        }

        content       = dataTooltip.helpText;
        defaultWidth  = dataTooltip.width ? dataTooltip.width : defaultWidth;
        defaultHeight = dataTooltip.height ? dataTooltip.height : defaultHeight;

        if(this.isUrl(content)){
            content = this._prepareFrameHtml(element, content);
        }else{
            content = dataTooltip.helpText;
        }

        content                 = '<div class="title help-title"><a class="pull-left p-left-5 help-drag" href="javascript:void(0);"><i class="fa fa-arrows"></i></a><a class="pull-right p-right-5 btn-close help-close" href="javascript:void(0);"><i class="fa fa-times-circle-o"></i></a></div>' + content;
        var viewThatCallTooltip = '.' + this.className,
            templatetooltip     = $('<div></div>');

        templatetooltip.html('<div class="help-tooltip tooltip font-size-16" role="tooltip"><div class="help-body tooltip-inner"><div></div></div></div>');
        templatetooltip.find('.help-tooltip').css('width', defaultWidth);
        templatetooltip.find('.help-tooltip').attr('data-default-width', defaultWidth);
        templatetooltip.find('.help-body').css('height', defaultHeight);
        templatetooltip.find('.help-body').attr('data-default-height', defaultHeight);

        element.tooltip({
            animation: false,
            trigger  : 'manual',
            container: viewThatCallTooltip,
            html     : true,
            template : templatetooltip.html(),
            title    : content
        });

        element.attr('tooltip-initialized', true);
    },
    isUrl                   : function(string){
        var expression = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        var regex      = new RegExp(expression);
        if(string.match(regex)){
            return true;
        }else{
            return false;
        }
    },
    setupValidationMessages : function(){
        var self = this;
        $.validator.addMethod('password_strength', function(value, element){
            return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,25}$/.test(value);
        });
        $.validator.setDefaults({
            showErrors    : function(){
                var amountOfErrors = this.numberOfInvalids();
                if(amountOfErrors > 0){
                    var message = $('<div class="alert alert-danger m-left-10" role="alert">' +
                                    'Please check your form, ' +
                                    'it contains ' + amountOfErrors +
                                    ' error' + (amountOfErrors > 1 ? 's' : '') +
                                    '.</div>');
                    if(!_.isUndefined(self.$el)){
                        self.$el.find('.status').html(message);
                    }
                }else{
                    if(!_.isUndefined(self.$el)){
                        self.$el.find('.status .alert-danger').remove();
                    }
                }
                this.defaultShowErrors();
            },
            errorPlacement: function(error, element){
                if(element.parents('.input-group').length){
                    element.parents('.input-group').after(error[0]);
                }
                else{
                    element.after(error[0]);
                }
            },
            ignore        : '.password-ignore',
            groups        : {
                names: 'doctorID doctorFacilityID'
            },
            rules         : {},
            messages      : {
                identity: {
                    required: 'El email es requerido',
                    email   : 'El email no tiene el formato correcto'
                },
                password: {
                    required: 'La contraseña es requerida'
                }
            }
        });
    },
    showAllEntities         : function(e){
        this.currentTargetArrow = e;
        var spinner             = '<i class="fa fa-circle-o-notch fa-spin"></i>';
        $(e.currentTarget).html(spinner);
        App.Helpers.showAllEntities(e, this.$el);
    }
});

App.Helpers.addMask        = Uit.addMask;
App.Helpers.cleanView      = Uit.cleanView;
App.Helpers.Model          = Uit.Model.extend({});
App.Helpers.Collection     = Uit.Collection.extend({});
App.Helpers.Router         = Uit.Router.extend({
    initialize     : function(){
        Uit.Router.prototype.initialize.call(this);
        this.token      = '';
        var sessionData = localStorage.getItem('currentSessionData');
        if(!_.isNull(sessionData)){
            var session = JSON.parse(sessionData);
            for(var key in session){
                if(session.hasOwnProperty(key)){
                    sessionStorage.setItem(key, session[key]);
                }
            }
        }
    },
    execute        : function(){
        this.beforeEach();
        this._persistMenu();
        Uit.Router.prototype.execute.apply(this, arguments);
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
            var header = new App.Views.Base.Header({model: App.loginModel});
            App.Helpers.htmlView(header, '.main-header');
        }
    },
    _sidebar       : function(){
        if(App.Helpers.checkViewExist('main_sidebar') === false){
            var sidebar = new App.Views.Base.MainSidebar({model: App.loginModel});
            App.Helpers.htmlView(sidebar, '.main-sidebar');
        }
    },
    _footer        : function(){
        if(App.Helpers.checkViewExist('footer') === false){
            var footer = new App.Views.Base.Footer({cacheHash: App.CacheHash});
            App.Helpers.htmlView(footer, '.main-footer');
        }
    },
    _sidebarControl: function(){
        if(App.Helpers.checkViewExist('sidebar_control') === false){
            var sidebarControl = new App.Views.Base.SidebarControl({cacheHash: App.CacheHash});
            App.Helpers.after(sidebarControl, '.main-footer');
        }
    },
    _login         : function(){
        if(App.loginModel.isLogin()){
            Backbone.history.navigate('profile', {trigger: true});
        }else{
            var model = App.loginModel;
            var login = new App.Views.Session.Login({model: model});
            App.Helpers.htmlView(login, '.login-box');
        }
    },
    _persistMenu   : function(){
        var hash   = window.location.hash,
            split  = hash.split('/'),
            parent = split[0],
            li     = $('[href="' + parent + '"]').parent();
        $('.sidebar-menu li').removeClass('active');
        li.addClass('active');
    }
});
App.Helpers.Modal          = Uit.Modal;
App.Helpers.htmlView       = Uit.htmlView;
App.Helpers.after          = Uit.after;
App.Helpers.checkViewExist = Uit.checkViewExist;
App.Helpers.append         = Uit.append;

App.Helpers.Casefriend.Rules = {
    doctorFacilityID     : {
        require_from_group: [1, '.doctor-facility']
    },
    doctorID             : {
        require_from_group: [1, '.doctor-facility']
    },
    password             : {
        required         : true,
        password_strength: true
    },
    password_confirmation: {
        equalTo: '#password'
    }
};

App.Helpers.getDesignations = function(treeDesignations, designationIDs){
    designationIDs   = _.isNull(designationIDs) ? '' : designationIDs;
    var designations = _.map(designationIDs.toString().split('|'), function(keyDesignation){
            return _.first(_.without(_.map(_.values(treeDesignations), function(designationObj){
                return designationObj[keyDesignation] ? designationObj[keyDesignation] : undefined;
            }), undefined));
        }) || [];

    return _.sortBy(designations);
};

App.Helpers.getFileURL = function(fileNumber, moduleID, eventID, billingID){
    moduleID    = moduleID || 1;
    eventID     = eventID || null;
    billingID   = billingID || null;
    var fileURL = App.Const.filesURLs[moduleID];
    fileURL += '/edit/' + fileNumber;

    if(!_.isNull(eventID)){
        if(eventID === 'all'){
            fileURL += '/events';
        }else{
            fileURL += '/events/edit/' + eventID;
            if(!_.isNull(billingID)){
                fileURL += '/billing/edit/' + billingID;
            }
        }
    }

    return fileURL;
};

App.Helpers.getFileDashboard = function(moduleID){
    var dashboard;
    switch(moduleID){
        case 1:
            dashboard = $('.files-dashboard').data('view');
            break;
        case 2:
            dashboard = $('.FilesDashboardSubro').data('view');
            break;
    }
    return dashboard;
};

(function($){
    $.extend($.expr[':'], {
        'off-top'   : function(el){
            return $(el).offset().top < $(window).scrollTop();
        },
        'off-right' : function(el){
            return $(el).offset().left + $(el).outerWidth() - $(window).scrollLeft() > $(window).width();
        },
        'off-bottom': function(el){
            return $(el).offset().top + $(el).outerHeight() - $(window).scrollTop() > $(window).height();
        },
        'off-left'  : function(el){
            return $(el).offset().left < $(window).scrollLeft();
        },
        'off-screen': function(el){
            return $(el).is(':off-top, :off-right, :off-bottom, :off-left');
        }
    });
})($);


$.extend($.validator.messages, App.Helpers.Casefriend.Messages);
$.extend($.validator.rules, App.Helpers.Casefriend.Rules);
