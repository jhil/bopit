bopit = angular.module('bopitApp')
.run(function($rootScope, bopitSock, bopitAudio) {
    
    //CHANGE LIGHT COLOR

        var commandLight = 'PUT';
        // var commandurlLight = 'http://10.20.206.119/api/newdeveloper/lights/3/state';      
        //Group
        var commandurlLight = 'http://10.20.206.119/api/newdeveloper/groups/0/action'; 

        //Yellow
        var messagebodyYellow = '{"on":true, "sat":255, "bri":255,"hue":12750}'; 

        //Purple
        var messagebodyPurple = '{"on":true, "sat":255, "bri":255,"hue":56100}'; 

        //Blue
        var messagebodyBlue = '{"on":true, "sat":255, "bri":255,"hue":46920}'; 


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



    $rootScope.$on("bop", function() {
        getHTML(commandLight, commandurlLight, messagebodyPurple);
    });

    $rootScope.$on("pull", function() {
        getHTML(commandLight, commandurlLight, messagebodyBlue);
    });

    $rootScope.$on("twist", function() {
        getHTML(commandLight, commandurlLight, messagebodyYellow);
    });
});
