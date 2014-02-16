bopit = angular.module('bopitApp')
.run(function($rootScope, bopitSock, bopitAudio, leapController) {
    var arePlaying = false;
    var normalFlag = false;

    $rootScope.$on("gameOver", function() {
        arePlaying = false;
    });

    leapController.loop(function(frame){
        if(frame.hands.length > 0) {
            var hand = frame.hands[0];

            if(hand.pitch() < -0.4) {
                if(normalFlag){
                    $rootScope.$emit("twist");
                    bopitSock.emit("state:playing:point", "Twist it!");
                    bopitAudio.twist.play();
                    $('#toyStripes').animate({ "margin-top": "-=60px" }, "fast" );
                    $('#toyStripes').animate({ "margin-top": "+=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(hand.stabilizedPalmPosition[0] > 100) {
                if(normalFlag){
                    $rootScope.$emit("pull");
                    bopitSock.emit("state:playing:point", "Pull it!");
                    bopitAudio.pull.play();
                    $('#toyPull').animate({ "margin-left": "+=60px" }, "fast" );
                    $('#toyPull').animate({ "margin-left": "-=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] < -5) {
                if(normalFlag){
                    if (arePlaying) {
                        $rootScope.$emit("bop");
                        bopitSock.emit("state:playing:point", "Bop it!");
                        bopitAudio.bop.play();
                        var toyBop = $('#toyBop');
                        toyBop.animate({ "margin-left": "+=66px", "margin-top": "+=20px", "height": "-=40px" }, "fast") ;
                        toyBop.animate({ "margin-left": "-=66px", "margin-top": "-=20px", "height": "+=40px" }, "fast") ;
                    } else {
                        arePlaying = true;
                        $rootScope.$emit("play");
                    }
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 &&
                    hand.stabilizedPalmPosition[2] > -20 &&
                    hand.stabilizedPalmPosition[2] < 100) {
                normalFlag = true;
            }
        }
    });
});
