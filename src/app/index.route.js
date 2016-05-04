(function () {
    'use strict';

    angular
        .module('newYt')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            // .when('/contact', {
            //     templateUrl: 'app/components/YouTubeApp/comments.html',
            //     controller: 'fireBaseController',
            //     controllerAs: 'firebase'
            // })
            .when('/:page/:query?', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/:page/:query?/:videoId?', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .otherwise({
              redirectTo: '/search'
            });
    }



})();
