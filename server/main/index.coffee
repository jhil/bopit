{check}            = require "validator"
q                  = require "q"

{email_server, io} = require "../"


randomN = (min, max) ->
  Math.random() * (max - min) + min

randomInt = (min, max) ->
  Math.floor(Math.random() * (max - min + 1)) + min


SETTINGS =
  numTurns: 4

  numUsers: 4


makeState = ->
  isPlaying:   false
  isAlive:     true
  score:       0
  currentUser: 0

  gameLoopI:   0

  getNextUser: ->
    if STATE.currentUser is (SETTINGS.numUsers-1)
    then 0
    else STATE.currentUser+1

  users: [
    name: 'jhilmd'
    current: true
  ,
    name: 'whatmariel'
    current: false
  ,
    name: '_lssr'
    current: false
  ,
    name: 'zfogg'
    current: false
  ]


STATE = makeState()


_lose = (socket) -> ->
  console.log "\ndisconnect: game over\n"
  clearInterval STATE.gameLoopI
  socket.emit "state:all:score", STATE.score
  socket.emit "state:all:users", STATE.users
  io.sockets.emit "state:gameOver"
  STATE = makeState()


io.sockets.on "connection", (socket) ->
  socket.on "state:lobby", ->
    socket.emit "state:all:score", STATE.score
    socket.emit "state:all:users", STATE.users

  socket.on "state:playing", ->
    STATE.isPlaying = true

    socket.on "disconnect", _lose socket

    unless STATE.gameLoopI > 0
      # Only send turns to the 'leader'
      STATE.gameLoopI = setInterval ->
        io.sockets.emit "state:playing:turn", [
          "bop", "twist", "pull"
        ][randomInt 0, 2]
      , 2000

  socket.on "state:gameOver", _lose socket

  socket.on "state:playing:point", (action) ->
    if STATE.isPlaying
      STATE.score++
      io.sockets.emit("state:all:score", STATE.score)

      if STATE.score % SETTINGS.numTurns is 0

        STATE.users[STATE.currentUser].current = false
        STATE.currentUser = STATE.getNextUser()
        STATE.users[STATE.currentUser].current = true

        io.sockets.emit("state:all:users", STATE.users)

exports.bopit = (req, res) ->
  res.json bopit: true
