angular.module('bopitApp')
  .controller "GameStateCtrl", ($scope, $rootScope, bopitSock, bopitAudio) ->

    bopitSock.emit "prePlay"

    $scope.users = []

    $scope.score = 0

    $scope.nextSound = new buzz.sound "/audio/intro.mp3"


    $rootScope.$on "mightLose", ->
      console.log "can possibly lose"

    $rootScope.$on "cantLose", ->
      console.log "no longer can lose"

    bopitSock.on "score", (s) -> $scope.$apply ->
      $scope.score = s

    bopitSock.on "users", (us) -> $scope.$apply ->
      $scope.users = us


    $rootScope.$on "play", ->
      bopitSock.emit "play"

      $scope.nextSound.play()

      bopitSock.on "turn", (command) -> $scope.$apply ->
        $scope.nextSound = bopitAudio.queueTurn($scope.nextSound, command)

