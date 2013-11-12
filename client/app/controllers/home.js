'use strict';

var genRoomName = function() {
    var text = "";
    var length = 10;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

angular.module('lookingGlass').controller('HomeCtrl',
    function($scope, $location, $routeParams, room, video){

        if ($routeParams.room === null || $routeParams.room === undefined || $routeParams.room === "") {
            var newRoomName = ($location.path() + '/' + genRoomName()).replace('//', '/');
            $location.path(newRoomName);
            return;
        }

        var id = genRoomName();
        $scope.peers = [];
        $scope.name = $routeParams.name;
        $scope.localSource = video.stream;

        video.stream.then( function(data) {
            room.join($routeParams.room, id, $routeParams.name);
        });

        room.onNewPeers( function(peers){
            $scope.peers = peers.filter( function (p) {
                return p.id !== id;
            }).map( function(p) {
                p.remoteSource = video.stream;
                return p;
            });
            $scope.$apply();
        });
    });
