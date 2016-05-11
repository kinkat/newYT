 (function () {
    "use strict";

    angular.module("newYt")
        .directive("playlistsItem", function () {
        return {
                restrict: "E",
                templateUrl: "app/components/YouTubeApp/playlist/playlist-item.html",

                scope:{

                    playlist: "="
                },
                require: "^playlistsDirective"
        };
    });

})();
