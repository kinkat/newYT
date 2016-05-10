(function() {
    'use strict';

    angular
        .module('newYt')
        .service('cacheService', cacheService);

    function cacheService() {
        var vm = this;
        var obj = {};
        var duration = {};

        vm.getCachedData = getCachedData;
        vm.saveVideos = saveVideos;
        vm.removeData = removeData;
        vm.saveTotalDuration = saveTotalDuration;
        vm.getDuration = getDuration;

        function saveVideos(key, data){
            obj[key] = data;
        }

        function getCachedData(key) {
            return obj[key] || [];
        }

        function removeData(key){
            obj[key] = [];
        }

        function saveTotalDuration(key, data){
            duration[key] = data;
        }

        function getDuration() {
          return duration;
        }
    }

})();
