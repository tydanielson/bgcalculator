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

	$scope.ratios = {};
	$scope.quote = {};

	$scope.isRevenueValid = function(value){
		return value >= 500 ? true:false;
	}

	$scope.calculatepts = function() {
		var totalpts = 0;

		//revenue over 500 million = one point
		if ($scope.isRevenueValid($scope.ratios.revenue)) {
			totalpts++;
		}

		//greater then 2.0 = half pt
		if ($scope.ratios.currentRatio >= 2.0) {
			totalpts = totalpts + 0.5;
		}

		//greater then 1.0 = half pt
		if ($scope.ratios.longTermDebtCoverageRatio >= 1.0) {
			totalpts = totalpts + 0.5;
		}

		//p/e less then 15 = one point
		if ($scope.quote.PeRatio <= 15) {
			totalpts++;
		}

		//p/b ratio less then 1.5 = one point
		if ($scope.quote.priceToBook  <= 1.5) {
			totalpts++;
		}

		//10 yrs of positive income = one point
		if ($scope.ratios.netincome === 10) {
			totalpts++;
		}

		//10 yrs of dividends = one point
		if ($scope.ratios.dividendTotal === 10) {
			totalpts++;
		}

		//10+ years of earning per share growth over 3%
		if ($scope.ratios.revenuetenyr >= 3.0) {
			totalpts++;
		}
		return totalpts;
	};

	$scope.getCompanyData = function() {
		//clear out the existing values
		$scope.ratios = {};
		$scope.quote = {};
		$scope.getStockQuote();
		$scope.getRatios();
	};

	$scope.getStockQuote = function() {
		var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/quote'
		$http.get(url)			
			.then(function(data){
				console.log("quote", data);
				$scope.quote = data.data;
				$scope.quote.priceToBook = $scope.quote.LastTradePrice/$scope.quote.BookValue;
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
				$scope.ratios.revenue = data.data.Revenue.Recent.TTM;
				//console.log(data.data.WorkingCapital.Historical);

				var workingCapital = data.data.WorkingCapital.Historical[Object.keys(data.data.WorkingCapital.Historical)[Object.keys(data.data.WorkingCapital.Historical).length - 1]];

				var longTermDebt = data.data.LongTermDebt.Recent["Latest Qtr"];
				var currentAssets = data.data.TotalCurrentAssets.Recent["Latest Qtr"];
				var currentLiabilities = data.data.TotalCurrentLiabilities.Recent["Latest Qtr"];
				$scope.ratios.longTermDebtCoverageRatio = (currentAssets-currentLiabilities)/longTermDebt;
				//console.log(workingCapital, longTermDebt);
				//$scope.ratios.longTermToWorking =
				$scope.ratios.revenuetenyr = data.data.RevenueTenYearAverage.Historical[Object.keys(data.data.RevenueTenYearAverage.Historical)[Object.keys(data.data.RevenueTenYearAverage.Historical).length - 1]];

				var divTot = 0;
				angular.forEach(data.data.Dividends.Historical, function(key, value) {
					if (key > 0){
						divTot++;
					}
				});
				$scope.ratios.dividendTotal = divTot;

				var netTot = 0;
				angular.forEach(data.data.NetIncome.Historical, function(key, value) {
					if (key > 0){
						netTot++;
					}
				});
				$scope.ratios.netincome = netTot;
 

			}, function(data){
				alert('error');
			});
	};

});
})();