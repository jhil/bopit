{check}            = require "validator"
q                  = require "q"

{db, email_server, io} = require "../"


io.sockets.on "connection", (socket) ->

  socket.emit "score", score
  socket.emit "users", users

  socket.on "point", (action) ->
    score++
    io.sockets.emit "score", score
    console.log action


users = [
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

score = 0


exports.bopit = (req, res) ->
  res.json bopit: true
