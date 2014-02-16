angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http) ->

	leap = new Leap.Controller();

	leap.on 'deviceDisconnected', () ->
	  $('.connected').hide()
	  $('.disconnected').fadeIn("slow")

	leap.on 'deviceConnected', () ->
	  $('.connected').fadeIn("slow")
	  $('.disconnected').hide()

	leap.connect()

	if leap.timestamp == undefined
	  $('.connected').hide()
	  $('.disconnected').fadeIn("slow")
	else
	  $('.disconnected').hide()
	  $('.connected').fadeIn("slow")

	return

