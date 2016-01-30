(function(){

var app = angular.module('wsi', ['ngMaterial'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('blue');

});

app.controller('WsiCtrl', ['$scope', function($scope){

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

	$scope.calculate = function(){
		console.log($scope.ben);
	}

}]);
})();