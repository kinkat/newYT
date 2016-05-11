 (function () {
    "use strict";

    angular.module("newYt")
        .directive("playlistsDirective", function () {
        return {
                replace: true,
                restrict: "E",
                templateUrl: "app/components/YouTubeApp/playlist/playlist.html",
                scope: {
                    test: "=",
                    playlists: "="
                }

        };
    });

})();
