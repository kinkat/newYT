(function(){
    "use strict";

    angular.module("newYt")
    .directive("loginDirective", function(){
        return{
            restrict: "E",
            templateUrl: "app/components/YouTubeApp/loginTemplate.html"
        };
    })

})();