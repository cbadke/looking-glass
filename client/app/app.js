angular.module('lookingGlass', ['ngResource'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/:room', {
			templateUrl: '/app/views/home.html',
			controller: 'HomeCtrl'
		})
		.otherwise({
			redirectTo: '/'
		})
}])
.run(['$rootScope', function($rootScope){

}]);

