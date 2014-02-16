angular.module('bopitApp')

  .factory "bopitAudio", ($rootScope) ->

    sounds = [
      "bop"
      "pull"
      "twist"
    ]

    sounds_ = {}

    for sound in sounds
      sounds_[sound] = new buzz.sound "/audio/sound-#{sound}.mp3"

    sounds_.queueTurn = (prevSound, command) ->
      ss = [
        new buzz.sound "/audio/command-#{command}.mp3"
        new buzz.sound "/audio/fill.mp3"
        new buzz.sound "/audio/break.mp3"
        new buzz.sound "/audio/fill.mp3"
      ]

      ss[0].bind "ended", -> ss[1].play()
      ss[1].bind "ended", ->
        ss[2].play()
        $rootScope.$emit "mightLose"
      ss[2].bind "ended", -> ss[3].play()
      ss[3].bind "ended", ->
        $rootScope.$emit "cantLose"

      if prevSound.isEnded()
      then ss[0].play()
      else prevSound.bind "ended", -> ss[0].play()

      ss[3]

    sounds_

