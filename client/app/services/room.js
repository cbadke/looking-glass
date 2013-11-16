'use strict'

navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

window.RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
//var RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
window.RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

//var server = {
    //iceServers: [
//        {url: "stun:stun.l.google.com:19302"}
    //]
//};

angular.module('lookingGlass').constant('socketio', io);

angular.module('lookingGlass').factory('room', function($q, $window, $rootScope, $sce, socketio, video) {
    var socket = socketio.connect('/');
    var peerObservers = [];
    var connections = {};
    var localId = undefined;
    var peers = [];

    var rtcConstraints = {
        //optional: [ {DtlsSrtpKeyAgreement: true} ],
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        }
    };

    var genPeerConnection = function(id) {
        return video.stream.then( function(stream) {
            var pc = new $window.RTCPeerConnection(null, rtcConstraints);
            pc.addStream(stream);

            pc.onaddstream = function (streamEvent) {
                peers.forEach( function(p) {
                    if (p.id === id) {
                        var url = $window.URL.createObjectURL(streamEvent.stream);
                        p.streamPromise.resolve(url);
                    }
                });

                $rootScope.$apply();
            };
            
            return pc;
        });
    }

    socket.on('peers', function(data) {
        peers = data.peers.map(function (p) {
            var stream = $q.defer();
            p.streamPromise = stream;
            return p;
        });

        var newPeers = peers.map(function (p) {
            p.remoteSource = "";
            
            p.streamPromise.promise.then( function(stream) {
                p.remoteSource = $sce.trustAsResourceUrl(stream);
            });
            return p;
        });
        peerObservers.forEach( function(o) {
            o(newPeers);
        });
    });

    socket.on('provideOffer', function(peerIds) {

        peerIds.filter(function(id) {
            return id !== localId;
        }).forEach( function (id) {
            genPeerConnection(id).then( function(pc) {

                pc.createOffer( function (offer) {
                    pc.setLocalDescription(offer, function() {
                        socket.emit('offer', {offer : JSON.stringify(offer), to : id});
                    });
                });

                connections[id] = pc;
            });
        });
    });

    socket.on('offer', function (data) {
        genPeerConnection(data.peerId).then( function(pc) {

            var desc = new $window.RTCSessionDescription(JSON.parse(data.offer));
            pc.setRemoteDescription( desc, function() {
                pc.createAnswer( function (answer) {
                    pc.setLocalDescription(answer, function() {
                        socket.emit('answer', {answer : JSON.stringify(answer), to : data.peerId});
                    });
                });
            });

            connections[data.peerId] = pc;
        });
    });

    socket.on('answer', function (data) {
        var pc = connections[data.peerId];
        pc.setRemoteDescription(new $window.RTCSessionDescription(JSON.parse(data.answer)));
    });

    return {
        join : function(roomName, id, name) {
                   localId = id;
                   socket.emit('join', {room : roomName, id : id, name : name});
               },
        onNewPeers : function(callback) {
                         peerObservers.push(callback);
                     }
    };
});
