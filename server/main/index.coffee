{check}            = require "validator"
q                  = require "q"

{db, email_server, io} = require "../"


randomN = (min, max) ->
  Math.random() * (max - min) + min

randomInt = (min, max) ->
  Math.floor(Math.random() * (max - min + 1)) + min


SETTINGS =
  numTurns: 4

  numUsers: 4


STATE =
  isPlaying:   false
  isAlive:     true
  score:       0
  currentUser: 0
  users:       []

  getNextUser: ->
    if STATE.currentUser is (SETTINGS.numUsers-1)
    then 0
    else STATE.currentUser+1


STATE.users = [
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


io.sockets.on "connection", (socket) ->
  socket.emit "score", STATE.score
  socket.emit "users", STATE.users

  socket.on "play", ->
    setInterval ->
      socket.emit "turn",  ["bop", "twist", "pull"][randomInt 0, 2]
    , 2000

  socket.on "point", (action) ->
    STATE.score++
    io.sockets.emit("score", STATE.score)

    if STATE.score % SETTINGS.numTurns is 0

      STATE.users[STATE.currentUser].current = false
      STATE.currentUser = STATE.getNextUser()
      STATE.users[STATE.currentUser].current = true

      io.sockets.emit("users", STATE.users)


exports.bopit = (req, res) ->
  res.json bopit: true
