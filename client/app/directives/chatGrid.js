'use strict'

angular.module('lookingGlass').directive('chatGrid', function() {
    return {
        restriction : 'A',
        link : function(scope, element, attrs) {

            scope.$watch(attrs.peerCount, function(value) {
                var columnCount = 1;

                if (value > 4) {
                    columnCount = 3;
                } else if (value > 1) {
                    columnCount = 2;
                } else {
                    columnCount = 1;
                }

                element.removeClass('peer-column-3');
                element.removeClass('peer-column-2');
                element.removeClass('peer-column-1');
                element.addClass('peer-column-' + columnCount);
            });
        }
    };
});
