'use strict';

(function(){
	angular.module('wsi')
		.controller('MainCtrl', function($scope, $http, $q, UserService, $firebaseAuth){

		//add user to the resolve at some point... 
		$scope.user = UserService.getUser();
		console.log($scope.user);
		$scope.loggedIn = false;

		if ($scope.user.email !== undefined) {
			$scope.loggedIn = true;
		}

		var auth = $firebaseAuth();
		var provider = new firebase.auth.GoogleAuthProvider();		

		$scope.googleAuth = function () {
			firebase.auth().signInWithPopup(provider).then(function(result) {
			  // This gives you a Google Access Token. You can use it to access the Google API.
			  var token = result.credential.accessToken;
			  // The signed-in user info.
			  var user = result.user;
			  $scope.loggedIn = true;
			  //dUserService.setUser(user);
			  console.log(user);
			  $scope.user = user;
			  $scope.$apply();
			  //$scope.reset();
			  //save the user? 
			  // ...
			}).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // The email of the user's account used.
			  var email = error.email;
			  // The firebase.auth.AuthCredential type that was used.
			  var credential = error.credential;
			  // ...
			});
		}

		$scope.ratios = {};
		$scope.quote = {};

		$scope.history = [];

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
			return $q(function(resolve, reject) { 

				var totalpts = 0;
				var outOfPts = 6;
				
				if ($scope.isRevenueValid()) {
					totalpts++;
				}

				//sometimes this data is undefined for some stocks
				if ($scope.ratios.currentRatio !== undefined) {
					if ($scope.isCurrentRatioValid()) {
						totalpts = totalpts + 0.5;
					}
					outOfPts = outOfPts + 0.5;
				}

				//sometimes this data is null for some stocks
				if ($scope.ratios.longTermDebtCoverageRatio !== null) {
					if ($scope.isLongTermDebtCoverageRatioValid()) {
						totalpts = totalpts + 0.5;
					}
					outOfPts = outOfPts + 0.5;
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
				//console.log('got total', totalpts);
				resolve([totalpts, outOfPts]);
			});
		};

		$scope.getCompanyData = function() {
			//clear out the existing values
			$scope.ratios = {};
			$scope.quote = {};
			var qpromise = $scope.getStockQuote();
			var rpromise = $scope.getRatios();

			$q.all([
					qpromise, 
					rpromise
				])
				.then(function(data) {
					var tpromise = $scope.calculatepts();
					tpromise.then(function(data){
						$scope.totalpts = data[0];
						$scope.outOfPts = data[1];
						$scope.history.push({"company" : $scope.quote.Name, "score" : data[0], "outOfScore" : data[1]});
					});
				});
		}; 

		$scope.getStockQuote = function() {
			var defer = $q.defer();

			$http.get('/stock/quote/' + $scope.ben.ticker)
				.then(function(res){
					//console.log(res.data);
					if (res.data.quote === null) {
						var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/quote'
						$http.get(url)			
							.then(function(data){
								//console.log("quote", data);
								$scope.quote = data.data;
								$scope.quote.priceToBook = $scope.quote.LastTradePrice/$scope.quote.BookValue;
								//$scope.previousLookups.push({"company" : $scope.quote.Name, "score" : $scope.points});
								$http({
									url: '/stock/quote/' + $scope.ben.ticker, 
									data: {"quote": $scope.quote},
									method: "POST",
									headers: {
										'Content-Type': 'application/json'
									}})
									.then(function(data){
										//console.debug('data posted');
									});

								defer.resolve();
							}, function(data){
								def.reject("Failed to get quote");
								alert('Please wait... too many API calls.');
							});
					} else {
						$scope.quote = JSON.parse(res.data.quote);
						defer.resolve();
					}
				});

			return defer.promise;
		};

		$scope.getRatios = function() {
			var defer = $q.defer();
			$http.get('/stock/ratio/' + $scope.ben.ticker)
				.then(function(res){
					if(res.data.stock === null){
						var url = 'https://services.last10k.com/v1/company/' + $scope.ben.ticker + '/ratios'
						$http.get(url)			
							.then(function (data) {
								//console.debug("ratios", data);
								$scope.setRatioData(data);
								defer.resolve();

							}, function(data){
								alert('Please wait... too many API calls.');
								def.reject("Failed to get ratios");
							});
						
					} else {
						//set the ratio data here
						$scope.ratios = JSON.parse(res.data.stock);
						defer.resolve();
					}
			});
			return defer.promise;
		};

		$scope.setRatioData = function(data) {
			$scope.ratios.currentRatio = data.data.CurrentRatio.Recent["Latest Qtr"];
			$scope.ratios.dividend = data.data.Dividends.Recent.TTM;
			$scope.ratios.quick = data.data.QuickRatio.Recent["Latest Qtr"];
			$scope.ratios.revenue = data.data.Revenue.Recent.TTM;

			var workingCapital = data.data.WorkingCapital.Historical[Object.keys(data.data.WorkingCapital.Historical)[Object.keys(data.data.WorkingCapital.Historical).length - 1]];

			var longTermDebt = data.data.LongTermDebt.Recent["Latest Qtr"];
			var currentAssets = data.data.TotalCurrentAssets.Recent["Latest Qtr"];
			var currentLiabilities = data.data.TotalCurrentLiabilities.Recent["Latest Qtr"];
			$scope.ratios.longTermDebtCoverageRatio = (currentAssets-currentLiabilities)/longTermDebt;

			

			var ntarr = $.map(data.data.NetIncome.Historical, function(value, index) {
			    return [value];
			});
			//net income eldest 3 years
			var ntfirst3avg = (ntarr[0] + ntarr[1] + ntarr[2]) / 3;
			//net income newest 3 years
			var ntlast3avg = (ntarr[7] + ntarr[8] + ntarr[9]) / 3;
			//console.log(ntfirst3avg, ntlast3avg);
			var ntrevavg = (Math.pow(ntlast3avg/ntfirst3avg, 0.1) - 1) * 100;
			//console.log(ntrevavg); 
			$scope.ratios.revenuetenyr = ntrevavg;

			//divide old/new -1 * 100
			//$scope.ratios.revenuetenyr = data.data.RevenueTenYearAverage.Historical[Object.keys(data.data.RevenueTenYearAverage.Historical)[Object.keys(data.data.RevenueTenYearAverage.Historical).length - 1]];

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

			//save the data 
			$http({
				url: '/stock/ratio/' + $scope.ben.ticker, 
				data: {"ratios": $scope.ratios},
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				}})
				.then(function(data){
					//console.debug('data posted');
				});
				
		};

	});
})();