(function(){
    "use strict";

    angular.module('newYt')
    .factory("httpInterceptor", httpInterceptor)
    .config(config);

    httpInterceptor.$inject = ['$q', '$rootScope'];


    function httpInterceptor($q, $rootScope){
        var numLoadings = 0;
        return {
            request: function (config) {
                numLoadings++;
                $rootScope.$broadcast("loader_show");
                console.log('broadcast show ');
                return config || $q.when(config)
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                console.log('broadcast hide ');

                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast("loader_show");
                }
                return $q.reject(response);
            }
        };
    }

    function config($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

})();