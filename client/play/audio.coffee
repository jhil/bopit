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

    sounds_.buildTurn = (call, response) ->
      ss = [
        new buzz.sound "/audio/#{call}.mp3"
        new buzz.sound "/audio/fill.mp3"
        new buzz.sound "/audio/#{response}.mp3"
        new buzz.sound "/audio/fill.mp3"
      ]

    sounds_

