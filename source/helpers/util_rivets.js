(function(rivets){
    'use strict';

    rivets.formatters.time = function(value){
        if(value){
            return moment(value, 'hh:mm:ss').format('hh:mm A');
        }
    };

    rivets.formatters.linebreaksbr = function(value){
        if(value){
            return value.replace(/\n/g, '<br>');
        }
    };

    rivets.formatters.showIfFirstChar = function(hourly, litigationCode){
        if(hourly && litigationCode){
            var firstChar = litigationCode.charAt(0);
            return hourly && firstChar !== 'P';
        }
    };

    rivets.formatters.mathAddInt = function(value, add){
        if(value){
            return parseInt(value, 10) + parseInt(add, 10);
        }
    };

    rivets.formatters.getModuleName = function(value) {
        if(value){
            return App.Const.modules[value];
        }
    };

    rivets.formatters.eq = function(value, arg){
        if(value && arg){
            return value === arg;
        }
    };

    rivets.formatters.greater = function(value, arg){
        if(value && arg){
            return value > arg;
        }
    };

})(window.rivets);
