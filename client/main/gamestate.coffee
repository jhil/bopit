angular.module('bopitApp')
  .controller "GameStateCtrl", ($scope, bopitSock, $http) ->

    $scope.users = []

    $scope.score = 0

    $scope.nextSound = new buzz.sound "/audio/intro.mp3"

    $scope.nextSound.play()


    bopitSock.on "score", (s) -> $scope.$apply ->
      $scope.score = s

    bopitSock.on "users", (us) -> $scope.$apply ->
      $scope.users = us

    bopitSock.on "turn", (t) -> $scope.$apply ->
      $scope.nextSound?.bind "ended", (e) ->
        null
