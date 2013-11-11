'use strict'

angular.module('lookingGlass').filter('initialCaps', function() {
    return function(input) {
        return input.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase();});
    };
});
