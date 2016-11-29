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
		        .state('index.home', {
		        	url: '/calculator',
		            views: {
		                'main': {
		                    templateUrl: '../partials/main.html',
		                }
		            }
		        })
		       	.state('index.login', {
		        	url: '/login',
		        	abstract: true,
		            views: {
		                'main': {
		                    template: '<div ui-view="form"></div>',
		                    controller: "LoginCtrl"
		                }
		            }
		        })
		       	.state('index.login.signin', {
		        	url: '/signin',
		            views: {
		                'form': {
		                    templateUrl: '../partials/login.tpl.html',
		                }
		            }
		        })
		       	.state('index.login.signup', {
		        	url: '/signup',
		            views: {
		                'form': {
		                    templateUrl: '../partials/signup.tpl.html',
		                }
		            }
		        })

	});

})();