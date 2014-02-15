{check}            = require "validator"
q                  = require "q"

{db, email_server} = require "../"



exports.bopit = (req, res) ->
  res.json bopit: true

