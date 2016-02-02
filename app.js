(function(){

var app = angular.module('wsi', ['ngMaterial'])
    .config(function($mdThemingProvider, $httpProvider) {
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
		$httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = '';
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

});

app.controller('WsiCtrl', function($scope, $http){

	$scope.ben = {
		marketCap: 1,
		currentAssets: 1,
		currentDebt: 1,
		longTermDebt: 1,
		workingCapital: 1,
		yrsPositiveIncome: 1,
		yrsDividend: 1,
		yrsGrowth: 1,
		pe: 1,
		pb: 1,
		dividend: 1
	};

	$scope.calculate = function() {
		console.log($scope.ben);
	}

	$scope.getTickerData = function() {
		console.log($scope.ben.ticker);

		var url = 'https://services.last10k.com/v1/company/DE/balancesheet?formType=10-K&filingOrder=0';
		$http.get(url)			//callback: 'JSON_CALLBACK',
		.then(function(data){
			console.log(data);
		}, function(data){
			console.log(data);
		})
		var params = {
            // Request parameters
            "formType": "10-K",
            "filingOrder": "0",
        };
      
        // $.ajax({
        //     url: "https://services.last10k.com/v1/company/DE/balancesheet&" + $.param(params),
        //     beforeSend: function(xhrObj){
        //         // Request headers
        //         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","5053da1874224fb1a0de3c4cd5f51a60");
        //     },
        //     type: "GET"
        // })
        // .done(function(data) {
        //     alert("success");
        // })
        // .fail(function() {
        //     alert("error");
        // });
	}

});
})();