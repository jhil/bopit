angular.module('bopitApp')
  .controller "GameStateCtrl", ($scope, $rootScope, bopitSock, bopitAudio) ->

    bopitSock.emit "state:lobby"

    $scope.users = []

    $scope.score = 0

    $scope.nextSounds = [new buzz.sound "/audio/intro.mp3"]


    commands = [
        name: "bop",   cb: ->
      ,
        name: "pull",  cb: ->
      ,
        name: "twist", cb: ->
    ]


    bopitSock.on "state:all:score", (s) -> $scope.$apply ->
      $scope.score = s

    bopitSock.on "state:all:users", (us) -> $scope.$apply ->
      $scope.users = us

    bopitSock.on "state:playing:turn", (command) -> $scope.$apply ->
      $scope.nextSounds = bopitAudio.queueTurn(
        $scope.nextSounds[$scope.nextSounds.length - 1], command)

    bopitSock.on "state:gameOver", -> $scope.$apply ->
      console.log "restarting game"
      bopitAudio.gameOver.play()

      $scope.nextSounds.map (s) -> s.stop()
      $scope.nextSounds = [new buzz.sound "/audio/intro.mp3"]


    $rootScope.$on "play", -> $scope.$apply ->
      bopitSock.emit "state:playing"
      $scope.nextSounds[0].play()
      $scope.score = 0

    $rootScope.$on "mightLose", (e, turnCommand) ->
      commands.map (cmd) ->
        cmd.cb = $rootScope.$on cmd.name, ->
          unless turnCommand is cmd.name
            console.log "lose!"
            $rootScope.$emit "cantLose"
            $rootScope.$emit "gameOver"
            bopitSock.emit "state:gameOver"

    $rootScope.$on "cantLose", ->
      console.log "stuff"
      commands.map (cmd) -> cmd.cb()

