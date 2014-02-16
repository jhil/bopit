angular.module('bopitApp')

  .factory "bopitAudio", ->

    sounds = [
      "bop"
      "pull"
      "twist"
    ]

    sounds_ = {}

    for sound in sounds
      sounds_[sound] = new buzz.sound "/audio/#{sound}.mp3"

    sounds_.queueTurn = (prevSound, command) ->
      ss = [
        new buzz.sound "/audio/command-#{command}.mp3"
        new buzz.sound "/audio/fill.mp3"
        new buzz.sound "/audio/break.mp3"
        new buzz.sound "/audio/fill.mp3"
      ]

      ss[0..-2].forEach (s, i) ->
        s.bind 'ended', ->
          ss[i+1].play()

      if prevSound.isEnded()
        ss[0].play()
      else
        prevSound.bind 'ended', ->
          ss[0].play()

      ss[ss.length-1]

    sounds_

