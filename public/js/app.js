(function(){

	angular.module('wsi', [
		'ngMaterial', 
		'ui.router'
	]).config(function($mdThemingProvider, $httpProvider, $urlRouterProvider, $stateProvider) {
	        $mdThemingProvider.theme('default')
	            .primaryPalette('green')
	            .accentPalette('blue');

			$httpProvider.defaults.headers.common = {};
			$httpProvider.defaults.headers.post = {};
			$httpProvider.defaults.headers.put = {};
			$httpProvider.defaults.headers.patch = {};
			$httpProvider.defaults.headers.common["Content-Type"] = "text/plain";
	 		$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
	 		$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
			$httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = '5053da1874224fb1a0de3c4cd5f51a60';
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];

			$urlRouterProvider.otherwise("/home");
			//
			// Now set up the states

		    $stateProvider
		        .state('home', {
		        	url: '/home',
		            views: {
		                'home': {
		                    templateUrl: '../partials/main.html',
		                    controller: 'MainCtrl'
		                }
		            }
		        })

	});

})();