angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http) ->

	leap = new Leap.Controller();

	$('.connected').hide()

	leap.on 'deviceDisconnected', () ->
	  $('.connected').hide()
	  $('.disconnected').show()

	leap.on 'connect', () ->
	  $('.connected').show()
	  $('.disconnected').hide()

	leap.on 'deviceConnected', () ->
	  $('.connected').show()
	  $('.disconnected').hide()

	leap.connect()

	return

