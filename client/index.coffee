bopit = angular.module('bopitApp', [
  'ngRoute'
  'ngAnimate'
])

  .config ($routeProvider, $locationProvider) ->

    $routeProvider
      .when '/',
        templateUrl: 'main/index.html'
        controller: 'MainCtrl'
      .when '/404',
        templateUrl: 'layout/404/index.html'
        controller: '404Ctrl'
      .otherwise
        redirectTo: '/404'
    $locationProvider.html5Mode(true)

  .controller "BodyCtrl", ($http, $scope, $rootScope, $timeout) ->
    $rootScope.isLoaded = true
    $scope.animClass = ''
    $scope.animReady = false

    $timeout ->
      $scope.animClass = "bopit-view"
      $scope.animReady = true
    , 10

    $rootScope.$on "$routeChangeStart", (e, next, current) ->
      null

  .controller "LeapCtrl", ($scope) ->
    $scope.numFingers = 0

    $scope.leap = leap = new Leap.Controller()

    colors = [
      "#ac4142"
      "#d26445"
      "#90a959"
      "#75b5aa"
      "#aa759f"
    ]

    [c, cHeight, cWidth] = do ->
      canvas = document.getElementById "canvas"
      canvas.width  = canvas.clientWidth
      canvas.height = canvas.clientHeight
      [ canvas.getContext('2d'), canvas.height, canvas.width]

    leap.on 'frame', (frame) -> $scope.$apply ->
      c.clearRect 0, 0, cWidth, cHeight

      $scope.numFingers = frame.fingers.length

      for f, i in frame.fingers
        [x, y, z] = f.tipPosition
        c.fillStyle = colors[i]
        c.fillRect x+(cWidth/2), (cHeight)-y, z, z
        #c.fillStyle = "#000000"

