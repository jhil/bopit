angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http, leapController) ->

    leapController.on 'deviceDisconnected', () ->
      $('.connected').hide()
      $('.disconnected').fadeIn("slow")

    leapController.on 'deviceConnected', () ->
      $('.connected').fadeIn("slow")
      $('.disconnected').hide()

    leapController.connect()

    if leapController.timestamp == undefined
      $('.connected').hide()
      $('.disconnected').fadeIn("slow")
    else
      $('.disconnected').hide()
      $('.connected').fadeIn("slow")
