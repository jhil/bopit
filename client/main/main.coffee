angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http) ->

	leap = new Leap.Controller();

	leap.on 'deviceDisconnected', () ->
	  $('.connected').hide()
	  $('.disconnected').show()

	leap.on 'deviceConnected', () ->
	  $('.connected').show()
	  $('.disconnected').hide()

	leap.connect()

	if leap.timestamp == undefined
	  $('.connected').hide()
	  $('.disconnected').show()
	else
	  $('.disconnected').hide()
	  $('.connected').show()

	return

