 (function () {
    "use strict";

    angular.module("newYt")
        .directive("subscriptionsItem", function () {
        return {
                restrict: "E",
                templateUrl: "app/components/YouTubeApp/subscriptions/subscriptions-item.html",
    
                scope:{
                    subscription: "="
                },
                require: "^subscriptionsDirective",
                link: function(scope, element, attrs, subCtrl){

                    scope.makeActive = function(){
                        subCtrl.setActiveSubscription(scope.subscription);
                    }
                    scope.subscriptionsActive = function(){
                        return subCtrl.getActiveSubscription() === scope.subscription.title;
                    }

                }
        };
    });

})();