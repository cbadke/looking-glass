'use strict'

angular.module('lookingGlass').factory('video', function($rootScope, $window, $q) {

        var deferredStream = $q.defer();
        var deferredStreamURL = $q.defer();

        navigator.getMedia(
            {
                audio: true,
                video: {
                    optional: [
                        { maxFrameRate: 30 }
                    ],
                    mandatory: {
                        maxWidth: 640,
                        maxHeight: 480,
                        minAspectRatio: 1.333, 
                        maxAspectRatio: 1.334
                    }
                },
                optional: {}
            },
            function(localMediaStream) {
                deferredStream.resolve(localMediaStream);
                deferredStreamURL.resolve($window.URL.createObjectURL(localMediaStream));
                $rootScope.$apply(); 
            },
            function(err){
                deferredStream.reject(err);
                deferredStreamURL.reject(err);
            }
        );

        return {
            stream : deferredStream.promise,
            streamURL : deferredStreamURL.promise
        };
});
