(function() {
    'use strict';

    angular
        .module('newYt')
        .service('cacheService', cacheService);

    function cacheService() {
        var vm = this;
        var obj = {};


        vm.getVideos = getVideos;
        vm.saveVideos = saveVideos;

        function saveVideos(key, data){
          obj[key] = data;
        }

        function getVideos(key) {
          return obj[key];
        }

    }

})();