bopit = angular.module('bopitApp')
.controller("LeapCtrl", function($scope) {
    $scope.leap = leap = new Leap.Controller();

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

            if(hand.pitch() < -0.2) {
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
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] > -20 && hand.stabilizedPalmPosition[2] < 60) {
                normalFlag = true;
            }
        }
        $('.score h1').text(score);
        return $scope.$apply();
    });
});
