(function () {
    'use strict';

    angular
        .module('newYt')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html?onload=onYouTubeIframeAPIReady',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/subscriptions', {
                // templateUrl: 'app/components/YouTubeApp/subscriptions.html',
                template: "<div> SUBSCRIPTIONS </div>",
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/contact', {
                templateUrl: 'app/main/contact2.html',
                controller: 'MainController',
                controllerAs: 'main'
            })

            .otherwise({
              redirectTo: '/'
            });
    }



})();
