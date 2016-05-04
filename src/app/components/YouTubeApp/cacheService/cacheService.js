(function() {
    'use strict';

    angular
        .module('newYt')
        .service('cacheService', cacheService);

    function cacheService() {
        var vm = this;
        var obj = {};
        
        vm.getCachedData = getCachedData;
        vm.saveVideos = saveVideos;
        vm.removeData = removeData;
        
        function saveVideos(key, data){
            obj[key] = data;
        }

        function getCachedData(key) {
            return obj[key] || [];
        }

        function removeData(key){
            obj[key] = [];
        }

    }

})();