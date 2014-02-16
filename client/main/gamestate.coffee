angular.module('bopitApp')
  .controller "GameStateCtrl", ($scope, $rootScope, bopitSock, bopitAudio) ->

    $scope.users = []

    $scope.score = 0

    $scope.nextSound = new buzz.sound "/audio/intro.mp3"


    bopitSock.on "score", (s) -> $scope.$apply ->
      $scope.score = s

    bopitSock.on "users", (us) -> $scope.$apply ->
      $scope.users = us


    $rootScope.$on "play", ->
      bopitSock.emit "play"

      $scope.nextSound.play()

      bopitSock.on "turn", (command) -> $scope.$apply ->
        $scope.nextSound = bopitAudio.queueTurn($scope.nextSound, command)

