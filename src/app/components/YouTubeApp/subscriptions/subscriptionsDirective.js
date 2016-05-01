 (function () {
    "use strict";

    angular.module("newYt")
        .directive("subscriptionsDirective", function (cacheService) {
        return {
                replace: true,
                restrict: "E",
                templateUrl: "app/components/YouTubeApp/subscriptions/subscriptions.html",
                scope:{
                    test: "=",
                    subscriptions: "="
                },
                controller: function($scope){
                    var vm = this;
                    vm.getActiveSubscription = function(){
                        return $scope.activeSubscription;
                    },
                    vm.setActiveSubscription = function(subscription){
                        $scope.activeSubscription = subscription;
                    }
                },

        };
    });

})();