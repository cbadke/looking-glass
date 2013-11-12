'use strict'

angular.module('lookingGlass').constant('socketio', io);

angular.module('lookingGlass').factory('room', function(socketio) {
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
