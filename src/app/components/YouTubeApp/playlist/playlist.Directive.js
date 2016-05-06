(function(){
    "use strict";

    angular.module("newYt")
    .directive("playlistDirective", function(){
        return{
            restrict: "E",
            templateUrl: "app/components/YouTubeApp/playlist/playlist.html"
        };
    })

})();