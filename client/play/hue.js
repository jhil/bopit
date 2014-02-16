bopit = angular.module('bopitApp')
.run(function($rootScope, bopitSock, bopitAudio) {
    $rootScope.$on("bop", function() {
        console.log("bop!");
    });

    $rootScope.$on("pull", function() {
        console.log("pull!");
    });

    $rootScope.$on("twist", function() {
        console.log("twist!");
    });
});
