angular.module('bopitApp')
    .controller('ViewportCtrl', function($scope, $http) {
        $scope.viewport = true;
        console.log("viewport controller!");
        return null;
    });
