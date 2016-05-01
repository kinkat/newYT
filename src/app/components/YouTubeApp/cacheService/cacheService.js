(function() {
    'use strict';

    angular
        .module('newYt')
        .service('cacheService', cacheService);

    function cacheService($q) {
        var vm = this;
        var obj = {};
        
        vm.getVideos = getVideos;
        vm.saveVideos = saveVideos;
        vm.removeData = removeData;
        
        function saveVideos(key, data){
            obj[key] = data;
        }

        function getVideos(key) {
            return obj[key] || [];
        }

        function removeData(key){
            obj[key] = [];
        }

    }

})();