(function(){
	"use strict";

	angular.module('newYt')
	.factory("YouTubeFactory", YouTubeFactory);
  	  	
  	YouTubeFactory.$inject = ['$http','YouTubeSearchDataService'];
  		var tempCache = [];
        var flagCache = true;

		function YouTubeFactory($http, YouTubeSearchDataService) {
		var objYT = {
			inputSearch: inputSearch,
			getSub: getSub,
            writeCache:writeCache,
            readCache:readCache,
            readFlag: readFlag,
            writeFlag: writeFlag
		};
		return objYT ;

		///////////////////////////////////// FUNCTIONS
		function inputSearch(query) {
			var youtubeDataToSend = YouTubeSearchDataService.searchNew("search?", query);
		
		// console.log(gapi.client.youtube.list);

			return $http({
                method: 'GET',
                url: youtubeDataToSend.url ,
                params: youtubeDataToSend.query,

            }).success(function(data){
            	console.log("data");
            });		
		}

		function getSub(query) {
			var youtubeDataToSend = YouTubeSearchDataService.searchNew("subscriptions?", query);

			return $http({
                method: 'GET',
                url: youtubeDataToSend.url ,
                params: youtubeDataToSend.query,

            })
		}

        function readCache(){
            return tempCache;
        }

        function writeCache(arr){
            tempCache = arr;
        }

        function readFlag(){
            return flagCache;
        }

        function writeFlag(flag){
            flagCache = flag;
        }
	}
})();