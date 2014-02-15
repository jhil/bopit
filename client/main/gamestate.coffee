angular.module('bopitApp')
  .controller "GameStateCtrl", ($scope, bopitSock, $http) ->

    $scope.users = []

    $scope.score = 0

    bopitSock.on "score", (s) -> $scope.$apply ->
      $scope.score = s

    bopitSock.on "users", (us) -> $scope.$apply ->
      $scope.users = us

