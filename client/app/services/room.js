'use strict'

navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

angular.module('lookingGlass').constant('socketio', io);

angular.module('lookingGlass').factory('video', function($rootScope, $window, $q) {

        var deferredStream = $q.defer();

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
                deferredStream.resolve($window.URL.createObjectURL(localMediaStream));
                $rootScope.$apply(); //this feels hacky. is there a better way?
            },
            function(err){
                deferredStream.reject(err);
            }
        );

        return {
            stream : deferredStream.promise
        };
});

angular.module('lookingGlass').factory('room', function(socketio, video) {
    var socket = socketio.connect('/');
    var peerObservers = [];

    socket.on('peers', function(data) {
        peerObservers.forEach( function(o) {
            o(data.peers);
        });
    });

    return {
        join : function(roomName, id, name) {
                   socket.emit('join', {room : roomName, id : id, name : name});
               },
        onNewPeers : function(callback) {
                         peerObservers.push(callback);
                     }
    };
});
