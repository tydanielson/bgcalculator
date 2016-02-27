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
		$httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = '5053da1874224fb1a0de3c4cd5f51a60';
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
		yrsPositiveIncome: '',
		yrsDividend: '',
		yrsGrowth: '',
		pe: 1,
		pb: 1,
		dividend: 1
	};

	$scope.ratios = {};

	$scope.calculate = function() {
		console.log($scope.ben);
	};

	$scope.getCompanyData = function() {
		//$scope.getBalanceSheet();
		$scope.getStockQuote();
		$scope.getRatios();
	};

	$scope.getBalanceSheet = function() {
		var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/balancesheet?formType=10-K&filingOrder=0';
		$http.get(url)			
			.then(function(data){
				console.log("balance", data);
				$scope.balance = data.data;
			}, function(data){
				alert('error');
			});
	};

	$scope.getStockQuote = function() {
		var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/quote'
		$http.get(url)			
			.then(function(data){
				console.log("quote", data);
				$scope.quote = data.data;
			}, function(data){
				alert('error');
			});
	};

	$scope.getRatios = function() {
		var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/ratios'
		$http.get(url)			
			.then(function(data){
				console.log("ratios", data);
				$scope.ratios.currentRatio = data.data.CurrentRatio.Recent["Latest Qtr"];
				$scope.ratios.dividend = data.data.Dividends.Recent.TTM;
				$scope.ratios.quick = data.data.QuickRatio.Recent["Latest Qtr"];
				console.log(data.data.WorkingCapital.Historical);

				var workingCapital = data.data.WorkingCapital.Historical[Object.keys(data.data.WorkingCapital.Historical)[Object.keys(data.data.WorkingCapital.Historical).length - 1]];
				var longTermDebt = data.data.LongTermDebt.Recent["Latest Qtr"];
				console.log(workingCapital, longTermDebt);
				//$scope.ratios.longTermToWorking =
			}, function(data){
				alert('error');
			});
	};

});
})();