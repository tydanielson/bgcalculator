(function(){

	angular.module('wsi', [
		'ngMaterial', 
		'ui.router',
		'firebase',
		'ngMessages'
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
			$httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = '9eb9c207f31a401298e028581a3738b7';
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];

			$urlRouterProvider.otherwise("/calculator");
			//
			// Now set up the states

		    $stateProvider
			    .state("index", {
	                abstract: true,
	                views: {
	                    "home": {
	                        template: "<div ui-view=\"main\"></div>",
	                        controller: "MainCtrl"
	                    }
	                }
	            })
		        .state('index.calculator', {
		        	url: '/calculator',
		            views: {
		                'main': {
		                    templateUrl: 'src/components/main.html',
		                }
		            }
		        });

	});

})();