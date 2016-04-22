(function(){
	"use strict";

	angular.module('newYt')
	.factory("YouTubeFactory", YouTubeFactory);
  	  	
  	YouTubeFactory.$inject = ['$http','YouTubeSearchDataService'];
  		var subChannelCache = [],
            flagCache = true,
            videosCache = [],
            subscribedChannels = [];

		function YouTubeFactory($http, YouTubeSearchDataService) {
		var objYT = {
			inputSearch: inputSearch,
			getSub: getSub,
            writeCache:writeCache,
            readCache:readCache,
            readChannelCache:readChannelCache,
            writeChannelCache:writeChannelCache,
            showSubscribedChannel: showSubscribedChannel,
            writeSubscribedChannel:writeSubscribedChannel,
            readFlag: readFlag,
            writeFlag: writeFlag
		};
		return objYT ;

		///////////////////////////////////// FUNCTIONS
		function inputSearch(query) {
			var youtubeDataToSend = YouTubeSearchDataService.searchNew("search?", query);
		
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
            return subChannelCache;
        }

        function writeCache(arr){
            subChannelCache = arr;
        }

        function readChannelCache(){
            return videosCache;
        }

        function writeChannelCache(arr){
            videosCache = arr;
        }

        function showSubscribedChannel(){
            return subscribedChannels;
        }

        function writeSubscribedChannel(arr){
            return subscribedChannels = arr;
        }

        function readFlag(){
            return flagCache;
        }

        function writeFlag(flag){
            flagCache = flag;
        }
	}
})();