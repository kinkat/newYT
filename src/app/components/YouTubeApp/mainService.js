(function(){
	"use strict";

	angular.module('newYt')
	.service('YouTubeSearchDataService', YouTubeSearchService);

	function YouTubeSearchService(){
		self = this;
		self.searchNew = searchNew;

		var youTubeSearchData = {
			url: "https://www.googleapis.com/youtube/v3/search?"
		};

		function searchNew (query){
			youTubeSearchData.query = query;
			return youTubeSearchData;
		}

	}


})();