'use strict';

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

angular.module('lookingGlass').controller('HomeCtrl', ['$scope', '$resource',
   function($scope, $resource){

       $scope.localSource = "blah";
      navigator.getMedia(
          {video:true, audio:true},
          function(localMediaStream) {
              $scope.localSource = window.URL.createObjectURL(localMediaStream);
              $scope.$apply();
          },
          function(err){
          });

   }]); 
