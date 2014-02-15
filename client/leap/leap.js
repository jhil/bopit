bopit = angular.module('bopitApp')
.controller("LeapCtrl", function($scope) {
    var c, cHeight, cWidth, colors, leap, _ref;
    $scope.numFingers = 0;
    $scope.leap = leap = new Leap.Controller();
    colors = ["#ac4142", "#d26445", "#90a959", "#75b5aa", "#aa759f"];
    _ref = (function() {
        var canvas;
        canvas = document.getElementById("canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        return [canvas.getContext('2d'), canvas.height, canvas.width];
    })(), c = _ref[0], cHeight = _ref[1], cWidth = _ref[2];
    return leap.on('frame', function(frame) {
        return $scope.$apply(function() {
            var f, i, x, y, z, _i, _len, _ref1, _ref2, _results;
            c.clearRect(0, 0, cWidth, cHeight);
            $scope.numFingers = frame.fingers.length;
            _ref1 = frame.fingers;
            _results = [];
            for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
                f = _ref1[i];
                _ref2 = f.tipPosition, x = _ref2[0], y = _ref2[1], z = _ref2[2];
                c.fillStyle = colors[i];
                _results.push(c.fillRect(x + (cWidth / 2), cHeight - y, z, z));
            }
            return _results;
        });
    });
});
