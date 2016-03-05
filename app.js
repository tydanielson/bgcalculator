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

	$scope.previousLookups = [];

	//revenue over 500 million = one point
	$scope.isRevenueValid = function(){
		return $scope.ratios.revenue >= 500 ? true : false;
	};

	//greater then 2.0 = half pt
	$scope.isCurrentRatioValid = function(){
		return $scope.ratios.currentRatio >= 2.0 ? true : false;
	};

	//greater then 1.0 = half pt
	$scope.isLongTermDebtCoverageRatioValid = function(){
		return $scope.ratios.longTermDebtCoverageRatio >= 1.0 ? true : false;
	};

	//p/e less then 15 = one point
	$scope.isPeRatioValid = function(){
		return $scope.quote.PeRatio <= 15 ? true : false;
	};

	//p/b ratio less then 1.5 = one point
	$scope.isPriceToBookValid = function(){
		return $scope.quote.priceToBook  <= 1.5 ? true : false;
	};

	//10 yrs of positive income = one point
	$scope.isNetIncomeValid = function(){
		return $scope.ratios.netincome === 10 ? true : false;
	};

	//10 yrs of dividends = one point
	$scope.isDividendTotalValid = function(){
		return $scope.ratios.dividendTotal === 10 ? true : false;
	};

	//10+ years of earning per share growth over 3%
	$scope.isRevenueTenYrValid = function(){
		return $scope.ratios.revenuetenyr >= 3.0 ? true : false;
	};

	$scope.calculatepts = function() {
		return $(function(resolve, reject) { 

			var totalpts = 0;
			
			if ($scope.isRevenueValid()) {
				totalpts++;
			}

			if ($scope.isCurrentRatioValid()) {
				totalpts = totalpts + 0.5;
			}

			if ($scope.isLongTermDebtCoverageRatioValid()) {
				totalpts = totalpts + 0.5;
			}

			if ($scope.isPeRatioValid()) {
				totalpts++;
			}

			if ($scope.isPriceToBookValid()) {
				totalpts++;
			}

			if ($scope.isNetIncomeValid()) {
				totalpts++;
			}

			if ($scope.isDividendTotalValid()) {
				totalpts++;
			}

			if ($scope.isRevenueTenYrValid()) {
				totalpts++;
			}

			resolve(totalpts);
		})
	};

	$scope.getCompanyData = function() {
		//clear out the existing values
		$scope.ratios = {};
		$scope.quote = {};
		$scope.getStockQuote();
		$scope.getRatios();

		//maybe add busy here...
		// var promise = calculatepts
		// $scope.previousLookups.push({"company" : $scope.quote.Name, "score" : $scope.points});
	}; 

	$scope.getStockQuote = function() {
		var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/quote'
		$http.get(url)			
			.then(function(data){
				console.log("quote", data);
				$scope.quote = data.data;
				$scope.quote.priceToBook = $scope.quote.LastTradePrice/$scope.quote.BookValue;
				//$scope.previousLookups.push({"company" : $scope.quote.Name, "score" : $scope.points});
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

				var workingCapital = data.data.WorkingCapital.Historical[Object.keys(data.data.WorkingCapital.Historical)[Object.keys(data.data.WorkingCapital.Historical).length - 1]];

				var longTermDebt = data.data.LongTermDebt.Recent["Latest Qtr"];
				var currentAssets = data.data.TotalCurrentAssets.Recent["Latest Qtr"];
				var currentLiabilities = data.data.TotalCurrentLiabilities.Recent["Latest Qtr"];
				$scope.ratios.longTermDebtCoverageRatio = (currentAssets-currentLiabilities)/longTermDebt;

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