angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http, leapController) ->
	connected = false

	leapController.connect()

	$('.connected').hide()
	leapController.on 'deviceDisconnected', () ->
		$('.connected').hide()
		$('.disconnected').fadeIn("slow")

	leapController.on 'deviceConnected', () ->
		$('.connected').fadeIn("slow")
		$('.disconnected').hide()

	leapController.on 'deviceFrame', (fr) ->
		connected = true

	testConnect = () ->
		if connected
			$('.connected').show()
			$('.disconnected').hide()

	setTimeout testConnect, 1000

	return