 (function () {
    "use strict";

    angular.module("newYt")
        .directive("playlistsDirective", function () {
        return {
                replace: true,
                restrict: "E",
                templateUrl: "app/components/YouTubeApp/playlist/playlist.html",
                controller: 'MainController',
                controllerAs: 'main',
                scope: {
                    test: "=",
                    playlists: "="
                }

        };
    });

})();
