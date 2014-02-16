angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http, leapController) ->
	leap = new Leap.Controller();
	connected = false

	leap.connect()

	$('.connected').hide()
	
    leap.on 'deviceDisconnected', () ->
      $('.connected').hide()
      $('.disconnected').fadeIn("slow")

    leap.on 'deviceConnected', () ->
      $('.connected').fadeIn("slow")
      $('.disconnected').hide()

	leap.on 'deviceFrame', (fr) ->
	  	connected = true

	testConnect = () ->
	  if connected
	  	$('.connected').show()
	  	$('.disconnected').hide()

	setTimeout testConnect, 1000

	return
