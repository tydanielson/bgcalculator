(function(){

var app = angular.module('wsi', ['ngMaterial'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('blue');

});

app.controller('WsiCtrl', ['$scope', function($scope){


}]);
})();