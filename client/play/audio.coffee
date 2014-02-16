angular.module('bopitApp')

  .factory "bopitAudio", ($rootScope, $timeout, roundState) ->

    sounds = [
      "bop"
      "pull"
      "twist"
    ]

    sounds_ = {}

    for sound in sounds
      sounds_[sound] = new buzz.sound "/audio/sound-#{sound}.mp3"

    sounds_.gameOver = do ->
      ss = [
        new buzz.sound "/audio/yell.mp3"
        new buzz.sound "/audio/fail.mp3"
        new buzz.sound "/audio/insult.mp3"
      ]
      ss[..-2].map (s, i) ->
        s.bind "ended", -> ss[i+1].play()
      ss[0]

    sounds_.queueTurn = (prevSound, command) ->
      ss = [
        new buzz.sound "/audio/command-#{command}.mp3"
        new buzz.sound "/audio/fill.mp3"
        new buzz.sound "/audio/break.mp3"
        new buzz.sound "/audio/fill.mp3"
      ]

      ss[0].bind "ended", ->
        ss[1].play()

      ss[1].bind "ended", ->
        ss[2].play()

      ss[2].bind "ended", ->
        $rootScope.$emit "cantLose"
        ss[3].play()

      ss[3].bind "ended", ->

      if prevSound.isEnded()
        ss[0].play()
        $rootScope.$emit "mightLose", command
      else
        prevSound.bind "ended", ->
          ss[0].play()
          $rootScope.$emit "mightLose", command

      ss

    sounds_

