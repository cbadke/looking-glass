'use strict'

angular.module('lookingGlass').directive('chatPeer', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/views/chat-peer.html',
        scope: {
            peer : '='
        }
    };
});
