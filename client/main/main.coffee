angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http) ->

	leap = new Leap.Controller();
	connected = false

	leap.connect()

	$('.connected').hide()

	leap.on 'deviceDisconnected', () ->
	  $('.connected').hide()
	  $('.disconnected').show()

	leap.on 'deviceConnected', () ->
	  $('.connected').show()
	  $('.disconnected').hide()


	leap.on 'deviceFrame', (fr) ->
	  	connected = true

	testConnect = () ->
	  if connected
	  	$('.connected').show()
	  	$('.disconnected').hide()

	setTimeout testConnect, 1000

	return

