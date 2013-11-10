'use strict';

navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

var genRoomName = function() {
    var text = "";
    var length = 10;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

angular.module('lookingGlass').constant('socketio', io);

angular.module('lookingGlass').factory('room', function(socketio) {
    var socket = socketio.connect('/');

    return {
        join : function(roomName) {
                   socket.emit('join', {room : roomName});
                }
    };
});

angular.module('lookingGlass').controller('HomeCtrl',
    function($scope, $location, $routeParams, $window, room){

        if ($routeParams.room === null || $routeParams.room === undefined || $routeParams.room === "") {
            var newRoomName = ($location.path() + '/' + genRoomName()).replace('//', '/');
            $location.path(newRoomName);
            return;
        }

        navigator.getMedia(
            {
                audio: true,
                video: {
                    mandatory: {
                        maxWidth: 640,
                        maxHeight: 480
                    }
                },
                optional: {}
            },
            function(localMediaStream) {
                $scope.localSource = $window.URL.createObjectURL(localMediaStream);
                $scope.$apply();

                room.join($routeParams.room);
            },
            function(err){});
        });
