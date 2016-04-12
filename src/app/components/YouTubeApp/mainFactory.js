(function(){
	"use strict";

	angular.module('newYt')
	.factory("YouTubeFactory", YouTubeFactory);
  	
  	YouTubeFactory.$inject = ['$http','YouTubeSearchDataService'];

		function YouTubeFactory($http, YouTubeSearchDataService) {
		var objYT = {
			initFactory: initFactory,
			getNew: getNew
		};
		return objYT ;

		///////////////////////////////////// FUNCTIONS

		function initFactory(query) {
			var youtubeSearchData = YouTubeSearchDataService.searchNew(query);

			return $http({
                method: 'GET',
                url: youtubeSearchData.url ,
                params:youtubeSearchData.query,

            });		
		}

		function getNew(query) {
			if(!query){
				query = "";
			}
			console.log("getNew function");
			// return $http.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0&'+ query);
		}

	}
})();