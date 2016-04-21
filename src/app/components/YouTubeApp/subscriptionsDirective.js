 (function () {
    "use strict";

    angular.module("newYt")
        .directive("subscriptionsDirective", function () {
        return {
                restrict: "E",
                templateUrl: "app/components/YouTubeApp/subscriptions.html"
        };
    });

})();