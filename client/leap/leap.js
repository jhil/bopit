bopit = angular.module('bopitApp')
.controller("LeapCtrl", function(bopitSock) {
    leap = new Leap.Controller();

    var bopAudio = document.createElement('audio');
    bopAudio.setAttribute('src', '/audio/sound-bop.mp3');
    var pullAudio = document.createElement('audio');
    pullAudio.setAttribute('src', '/audio/sound-pull.mp3');
    var twistAudio = document.createElement('audio');
    twistAudio.setAttribute('src', '/audio/sound-twist.mp3');

    var normalFlag = false;
    return leap.loop(function(frame){
        if(frame.hands.length > 0) {
            var hand = frame.hands[0];

            if(hand.pitch() < -0.2) {
                if(normalFlag){
                    bopitSock.emit("point", "Twist it!");
                    twistAudio.play();
                    $('#toyStripes').animate({ "margin-top": "-=60px" }, "fast" );
                    $('#toyStripes').animate({ "margin-top": "+=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(hand.stabilizedPalmPosition[0] > 100) {
                if(normalFlag){
                    bopitSock.emit("point", "Pull it!");
                    pullAudio.play();
                    $('#toyPull').animate({ "margin-left": "+=60px" }, "fast" );
                    $('#toyPull').animate({ "margin-left": "-=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] < -10) {
                if(normalFlag){
                    bopitSock.emit("point", "Bop it!");
                    bopAudio.play();
                    var toyBop = $('#toyBop');
                    toyBop.animate({ "margin-left": "+=35px", "margin-top": "+=10px", "height": "-=20px" }, "fast") ;
                    toyBop.animate({ "margin-left": "-=35px", "margin-top": "-=10px", "height": "+=20px" }, "fast") ;
                }
                normalFlag = false;
<<<<<<< HEAD
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] > -20 && hand.stabilizedPalmPosition[2] < 60) {
=======
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 &&
                    hand.stabilizedPalmPosition[2] > -20 &&
                    hand.stabilizedPalmPosition[2] < 60) {
>>>>>>> 4134a1fed0b51193c5c606954954c73d90ea05dd
                normalFlag = true;
            }
        }
    });
});
