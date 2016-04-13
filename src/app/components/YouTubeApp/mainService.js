(function(){
	"use strict";

	angular.module('newYt')
	.service('YouTubeSearchDataService', YouTubeSearchService);

	function YouTubeSearchService(){
		var vm = this;
		vm.searchNew = searchNew;
		vm.getBaseUrl = getBaseUrl;

		vm.youTubeSearchData = {
		};

		function getBaseUrl(param){
			return "https://www.googleapis.com/youtube/v3/" + param;
		}

		function searchNew (param, query){ 
			vm.youTubeSearchData.url = getBaseUrl(param);
			vm.youTubeSearchData.query = query;
			return vm.youTubeSearchData;
		}

	}


})();