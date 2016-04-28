(function () {
    'use strict';

    angular
        .module('newYt')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/:page/:query?', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            // .when('/search/:query', {
            //     templateUrl: 'app/main/main.html',
            //     controller: 'MainController',
            //     controllerAs: 'main'
            // })
            .when('/contact', {
                templateUrl: 'app/main/contact2.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            // .when('/subscriptions/:id', {
            //     templateUrl: 'app/main/main.html',
            //     controller: 'MainController',
            //     controllerAs: 'main'
            // })

            .otherwise({
              redirectTo: '/search'
            });
    }



})();
