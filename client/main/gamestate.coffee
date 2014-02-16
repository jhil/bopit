angular.module('bopitApp')
  .controller "GameStateCtrl", ($scope, $rootScope, bopitSock, bopitAudio, roundState) ->

    bopitSock.emit "state:lobby"

    $scope.users = []

    $scope.score = 0

    queuedSounds = []

    nextSounds = [new buzz.sound "/audio/intro.mp3"]


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
      if command is "passit"
        console.log "passit!"
        passit = new buzz.sound "/audio/passit.mp3"
        if nextSounds[nextSounds.length - 1].isEnded()
          passit.play()
        else
          nextSounds[nextSounds.length - 1].bind "ended", -> passit.play()
          nextSounds = [passit]
      else
        nextSounds = bopitAudio.queueTurn(
          nextSounds[nextSounds.length - 1], command)

      queuedSounds.push ns for ns in nextSounds

    bopitSock.on "state:gameOver:now", ->
      console.log "restarting game"

      roundState.gestures = 0

      queuedSounds.map (s) ->
        s.unbind("ended")
        s.stop()
      queuedSounds = []

      bopitAudio.gameOver.play()

      nextSounds = [new buzz.sound "/audio/intro.mp3"]


    $rootScope.$on "play", -> $scope.$apply ->
      bopitSock.emit "state:playing"

    bopitSock.on "state:playing", -> $scope.$apply ->
      nextSounds[0].play()
      $scope.score = 0

    $rootScope.$on "mightLose", (e, turnCommand) ->
      roundState.gestures   = 0
      roundState.passedTurn = false
      commands.map (cmd) ->
        cmd.cb = $rootScope.$on cmd.name, ->
          if turnCommand is cmd.name
            roundState.passedTurn = true
          else
            roundState.passedTurn = false
            $rootScope.$emit "cantLose"

    $rootScope.$on "cantLose", ->
      commands.map (cmd) -> cmd.cb()
      console.log roundState
      if roundState.passedTurn and roundState.gestures is 1
        console.log "winning!"
      else
        console.log "losing!"
        $rootScope.$emit "gameOver"
        bopitSock.emit "state:gameOver"
      roundState.passedTurn = false
      roundState.gestures   = 0

    commands.map (cmd) ->
      $rootScope.$on cmd.name, ->
        roundState.gestures++
        if roundState.gestures > 1
          $rootScope.$emit "cantLose"
