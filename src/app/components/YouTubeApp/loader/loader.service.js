(function(window){
    "use strict";

    angular.module('newYt')
    .factory("httpInterceptor", httpInterceptor)
    .config(configInterceptor);

    httpInterceptor.$inject = ['$q', '$rootScope', '$log'];

    function httpInterceptor($q, $rootScope, $log){
        var numLoadings = 0;
        return {
            request: function (config) {
                numLoadings++;
                $rootScope.$broadcast("loader_show");
                console.log('broadcast pokaz');
                return config || $q.when(config)
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast("loader_hide");
                }
                return $q.reject(response);
            }
        };
    }

    function configInterceptor($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

})();