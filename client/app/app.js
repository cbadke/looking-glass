angular.module('lookingGlass', ['ngResource'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/app/views/home.html',
			controller: 'HomeCtrl'
		})
		.otherwise({
			redirectTo: '/'
		})
}])
.run(['$rootScope', function($rootScope){

}]);

