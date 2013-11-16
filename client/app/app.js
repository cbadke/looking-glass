'use strict'

angular.module('lookingGlass', ['ngResource', 'ngRoute'])
.config(function($routeProvider){
	$routeProvider
		.when('/:room/:name', {
			templateUrl: '/app/views/home.html',
			controller: 'HomeCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
})
.run(['$rootScope', function($rootScope){

}]);

