'use strict';
//logout for 401 responses.
$.ajaxSetup({
    statusCode: {
        401: function(){
            // Redirect the to the login page.
            App.loginModel.logout();

        },
        307: function(){
            //new code needs to be fetch instead of using cache version so force a refresh.
            var timeoutFadeout = 10000;
            var secondsCounter = 6;
            var msg = `Website code updated, your browser will refresh to clear cache in <span class="cache-counter-seconds">${secondsCounter}</span> seconds...`;
            var toast = new App.Helpers.Toast({
                message  : msg,
                classType: 'warning',
                fadeOut  : 150000
            });
            toast.render();

            if (!App.CacheHashTimeout) {
                App.CacheHashTimeout = setInterval(function(){
                    $('.cache-counter-seconds').html(--secondsCounter);
                    if(secondsCounter <= 0){
                        clearInterval(App.CacheHashTimeout);
                        delete App.CacheHashTimeout;
                    }
                }, timeoutFadeout / 6);

                setTimeout(function(){
                    location.reload();
                }, timeoutFadeout);
            }

        },
        // 200: function(a,b,c,d){
        //     debugger;
        // }
    }
});

// // Override ajax to put token on post and put request for csrf protection.
var ajax = $.ajax;
$.ajax = function(options){
    if(options.type){
        if(options.type.toLowerCase() === 'post' || options.type.toLowerCase() === 'put' || options.type.toLowerCase() === 'delete'){
            var token_name = $.cookie('token_name');
            var cf_csrf_hash = $.cookie('cf_csrf_cookie');
            if(!_.isUndefined(options.data) &&
               options.url !== '/api/user_controller/signature_file_upload' &&
               options.url !== '/api/documents_controller/document_upload' &&
               options.url !== '/api/letters_word_controller/upload_letter' &&
               options.url !== '/api/letters_pdf_controller/upload_letter' &&
               options.url !== '/api/documents_controller/document_client_rep_upload'){//ugly solution.
                if(!_.isEmpty(options.data)){
                    options.data = JSON.parse(options.data);
                }
                options.data.cache_hash = App.CacheHash;
                options.data[token_name] = cf_csrf_hash;
                options.data = JSON.stringify(options.data);
            }
        }else{//backbone get
            if(_.isUndefined(options.data)){
                options.data = {};
                options.data.cache_hash = App.CacheHash;
            } else if (typeof options.data === 'string') {
                options.data += '&cache_hash=' + App.CacheHash;
            } else {
                options.data.cache_hash = App.CacheHash;
            }
        }
    } else {//regular jquery $.get
        if(typeof options === 'string'){
            options += '&cache_hash=' + App.CacheHash;
            arguments[0] = options;
        } else if (typeof options.data === 'string') {
            options.data += '&cache_hash=' + App.CacheHash;
        } else if (_.isUndefined(options.data)) {
            options.data = {};
            options.data.cache_hash = App.CacheHash;
        } else {
            options.data.cache_hash = App.CacheHash;
        }
    }
    return ajax.apply($, arguments);
};
