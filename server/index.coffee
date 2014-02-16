path    = require "path"

express = require "express"

q       = require "q"


passport = require 'passport'

TwitterStrategy = require('passport-twitter').Strategy


exports.app    = app    = express()
exports.server = server = require("http").createServer app
exports.io     = io     = require("socket.io").listen server, log: false


cacheTime = 86400000

staticDir = (p) ->
  express.static path.join(__dirname, p),
    maxAge: cacheTime
    redirect: false


app.configure "development", ->
  app.use require("connect-livereload")()
  app.use express.errorHandler()
  app.use express.logger "dev"

  app.use                staticDir "../.tmp"
  app.use "/components", staticDir "../components"
  app.use                staticDir "../client"


app.configure "production", ->
  app.use (req, res, next) ->
    res.setHeader "Cache-Control", "public, max-age=#{cacheTime}"
    res.setHeader "Expires"      , cacheTime
    res.setHeader "Pragma"       , "cache"
    next()

  app.use express.compress()


app.configure ->
  app.use staticDir "../public"

  app.use (req, res, next) ->
    res.setHeader "Cache-Control", "max-age=0, no-cache, no-store, must-revalidate"
    res.setHeader "Expires"      , 0
    res.setHeader "Pragma"       , "no-cache"
    next()

  app.use express.urlencoded()
  app.use express.methodOverride()
  app.use express.json()

  app.use express.cookieParser()
  app.use express.session({ secret: 'keyboard cat' })
  app.use passport.initialize()
  app.use passport.session()
  app.use app.router


# Twitter OAuth stuff

passport.use new TwitterStrategy
    consumerKey: 'LMCNe4nVK8CP2bAhOw2xQ'
    consumerSecret: 'Dh1Y9RoCBc9OEGfgPg4mIg1KxFXeEPjlLqyo4NFgePw'
    callbackURL: "//#{process.env.HOST or "localhost"}:#{process.env.PORT or 8000}/auth/twitter/callback"
  , (token, tokenSecret, profile, done) ->
    process.nextTick () ->
      return done null, profile

passport.serializeUser (user, done)->
  done(null, user)

passport.deserializeUser (user, done) ->
  done(null, user)


# Start server

ready = q.defer()

port = process.env.PORT or 8000
server.listen port, ->
  console.log "Listening on port %d in %s mode", port, app.get("env")
  ready.resolve()

exports.ready = ready.promise


exports.indexRoute = (req, res) ->
  res.sendfile path.resolve "#{__dirname}/../public/index.html"
