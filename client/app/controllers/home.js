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

angular.module('lookingGlass').controller('HomeCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){

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
                $scope.localSource = window.URL.createObjectURL(localMediaStream);
                $scope.$apply();
            },
            function(err){
            });
    }]); 
