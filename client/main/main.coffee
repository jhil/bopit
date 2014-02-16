angular.module('bopitApp')
  .controller 'MainCtrl', ($scope, $http, $window, leapController) ->

    $scope.twitterAuth = -> $window.location.href = "/auth/twitter"

    connected = false

    leapController.connect()

    $('.connected').hide()
    leapController.on 'deviceDisconnected', () ->
      $('.connected').hide()
      $('.disconnected').fadeIn("slow")

    testConnect = () ->
      if connected
        $('.connected').show()
        $('.disconnected').hide()
      clearTimeout(testTimeout);

    testTimeout = setTimeout testConnect, 1000

      testConnect = () ->
        if connected
          $('.connected').show()
          $('.disconnected').hide()

    setTimeout testConnect, 1000
