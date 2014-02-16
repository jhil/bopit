bopit = angular.module('bopitApp')
.controller("LeapCtrl", function($rootScope, bopitSock, bopitAudio) {
    leap = new Leap.Controller();

    var arePlaying = false;

    var normalFlag = false;



    //CHANGE LIGHT COLOR

        var commandLight = 'PUT';
        var commandurlLight = '/api/newdeveloper/lights/3/state';      

        //Yellow
        var messagebodyYellow = {"on":true, "sat":255, "bri":255,"hue":10000}; 

        //Purple
        var messagebodyPurple = {"on":true, "sat":255, "bri":255,"hue":10000}; 

        //Blue
        var messagebodyBlue = {"on":true, "sat":255, "bri":255,"hue":10000}; 

    //FAIL LIGHTS
        


    function getHTML(command, commandurl, messagebody)
    {
        if (window.XMLHttpRequest)
        {
            var http = new XMLHttpRequest();
            http.open(command, commandurl, true);

            http.onreadystatechange = function()
            {
                if(http.readyState == 4)
                {

                }
            }
            http.send(messagebody);
        }
        return false;
    }



    return leap.loop(function(frame){
        if(frame.hands.length > 0) {
            var hand = frame.hands[0];

            if(hand.pitch() < -0.4) {
                if(normalFlag){
                    $rootScope.$emit("twist");
                    bopitSock.emit("point", "Twist it!");
                    bopitAudio.twist.play();
                    $('#toyStripes').animate({ "margin-top": "-=60px" }, "fast" );
                    $('#toyStripes').animate({ "margin-top": "+=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(hand.stabilizedPalmPosition[0] > 100) {
                if(normalFlag){
                    $rootScope.$emit("pull");
                    bopitSock.emit("point", "Pull it!");
                    bopitAudio.pull.play();
                    $('#toyPull').animate({ "margin-left": "+=60px" }, "fast" );
                    $('#toyPull').animate({ "margin-left": "-=60px" }, "fast" );
                }
                normalFlag = false;
            } else if(Math.abs(hand.stabilizedPalmPosition[0]) < 30 && hand.stabilizedPalmPosition[2] < -5) {
                if(normalFlag){
                    if (arePlaying) {
                        $rootScope.$emit("bop");
                        bopitSock.emit("point", "Bop it!");
                        bopitAudio.bop.play();
                        var toyBop = $('#toyBop');
                        toyBop.animate({ "margin-left": "+=35px", "margin-top": "+=10px", "height": "-=20px" }, "fast") ;
                        toyBop.animate({ "margin-left": "-=35px", "margin-top": "-=10px", "height": "+=20px" }, "fast") ;
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
