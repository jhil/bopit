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
        var commandurlLightFail11 = 'http://10.20.206.119/api/newdeveloper/lights/1/pointsymbol';
        var commandurlLightFail12 = 'http://10.20.206.119/api/newdeveloper/lights/2/pointsymbol';
        var commandurlLightFail13 = 'http://10.20.206.119/api/newdeveloper/lights/3/pointsymbol';
        var messagebodyFail1 = '{"1":"0A00F1F01F1F1001F1FF100000000001F2F"}';

        var commandurlLightFail21 = 'http://10.20.206.119/api/newdeveloper/groups/0/transmitsymbol';
        var messagebodyFail2 = '{"symbolselection":"01010501010102010301040105","duration":2000}';

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

    // getHTML(commandLight, commandurlLightFail11, messagebodyFail1);
    // getHTML(commandLight, commandurlLightFail12, messagebodyFail1);
    // getHTML(commandLight, commandurlLightFail13, messagebodyFail1);
    // getHTML(commandLight, commandurlLightFail21, messagebodyFail2);

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
