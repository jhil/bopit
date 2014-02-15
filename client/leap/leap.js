bopit = angular.module('bopitApp')
.controller("LeapCtrl", function($scope) {
    $scope.leap = leap = new Leap.Controller();
    // var c, cHeight, cWidth, colors, leap, _ref;
    // $scope.numFingers = 0;
    // colors = ["#ac4142", "#d26445", "#90a959", "#75b5aa", "#aa759f"];
    // _ref = (function() {
    //     var canvas;
    //     canvas = document.getElementById("canvas");
    //     canvas.width = canvas.clientWidth;
    //     canvas.height = canvas.clientHeight;
    //     return [canvas.getContext('2d'), canvas.height, canvas.width];
    // })(), c = _ref[0], cHeight = _ref[1], cWidth = _ref[2];

    // return leap.on('frame', function(frame) {
    //     return $scope.$apply(function() {
    //         var f, i, x, y, z, _i, _len, _ref1, _ref2, _results;
    //         c.clearRect(0, 0, cWidth, cHeight);
    //         $scope.numFingers = frame.fingers.length;
    //         _ref1 = frame.fingers;
    //         _results = [];
    //         for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
    //             f = _ref1[i];
    //             _ref2 = f.tipPosition, x = _ref2[0], y = _ref2[1], z = _ref2[2];
    //             c.fillStyle = colors[i];
    //             _results.push(c.fillRect(x + (cWidth / 2), cHeight - y, z, z));
    //         }
    //         return _results;
    //     });
    // });

    var bopAudio = document.createElement('audio');
    bopAudio.setAttribute('src', '/audio/sound-bop.mp3');
    var pullAudio = document.createElement('audio');
    pullAudio.setAttribute('src', '/audio/sound-pull.mp3');
    var twistAudio = document.createElement('audio');
    twistAudio.setAttribute('src', '/audio/sound-twist.mp3');

    $scope.output = '';
    var score = 0;
    var normalFlag = false;
    return leap.loop(function(frame){
        if(frame.hands.length > 0) {
            var hand = frame.hands[0];

            if(hand.pitch() < -.2) {
                if(normalFlag){
                    twistAudio.play();
                    $('#toyStripes').animate({ "margin-top": "-=60px" }, "fast" );
                    $('#toyStripes').animate({ "margin-top": "+=60px" }, "fast" );
                    score = score + 1;
                }
                normalFlag = false;
            } else if(hand.stabilizedPalmPosition[0] > 100) {
                if(normalFlag){
                    pullAudio.play();
                    $('#toyPull').animate({ "margin-left": "+=60px" }, "fast" );
                    $('#toyPull').animate({ "margin-left": "-=60px" }, "fast" );
                    score = score + 1;
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] < -10) {
                if(normalFlag){
                    bopAudio.play();
                    var toyBop = $('#toyBop');
                    toyBop.animate({ "margin-left": "+=35px", "margin-top": "+=10px", "height": "-=20px" }, "fast") ;
                    toyBop.animate({ "margin-left": "-=35px", "margin-top": "-=10px", "height": "+=20px" }, "fast") ;
                    score = score + 1;
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] > -20 
                    && hand.stabilizedPalmPosition[2] < 60) {
                normalFlag = true;
            }
        }
        $('.score h1').text(score);
        return $scope.$apply();
    });
});
