(function(window){
	"use strict";

	angular.module('newYt')
	.factory("YouTubeFactory", YouTubeFactory);
  	  	
  	YouTubeFactory.$inject = ['$http','YouTubeSearchDataService','$q'];

		function YouTubeFactory($http, YouTubeSearchDataService, $q) {
		var objYT = {
			inputSearch: inputSearch,
			getVideosFromChannel: getVideosFromChannel,
            getMySubscriptions: getMySubscriptions,
		};
		return objYT ;

		///////////////////////////////////// FUNCTIONS
		function inputSearch(query, pageToken) {
            var defere = $q.defer();
            // console.log('LAST PAGE TOKEN: ', pageToken);
            if(query === ''){
                defere.reject();
            } else {            
                var request = gapi.client.youtube.search.list({
                        part: "snippet",
                        q: query,
                        maxResults: 20,
                        type: 'video',
                        pageToken: pageToken
                    });
                request.execute(function (data) {
                    defere.resolve(data);
                });
            }
            return defere.promise;
	
		}

        function getMySubscriptions(){
            var defere = $q.defer(),
                tempSubArr = [],
                request = gapi.client.youtube.subscriptions.list({
                    part: "snippet",
                    mine: true,
                    maxResults:15
                });
            request.execute(function (data) {
                angular.forEach(data.items, function(items){
                    tempSubArr.push(items.snippet);
                });
                defere.resolve(tempSubArr);
            });
            return defere.promise;

        }

        function getVideosFromChannel(channel, pageToken) {
            var channelTitle = channel.title ? channel.title : channel,
                defered = $q.defer(),
                request = gapi.client.youtube.channels.list({
                part: "contentDetails",
                forUsername: channelTitle
            });
            request.execute(function (data) {
                if(angular.isUndefined(data.items[0].contentDetails)){
                    defered.reject();
                    return;
                }else{
                    var uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
                    var requestToExtractVideos = gapi.client.youtube.playlistItems.list({
                    part: "snippet,contentDetails",
                    playlistId: uploads,
                    maxResults:15,
                    pageToken: pageToken
                    });
                    requestToExtractVideos.execute(function(videosFromChannel){
                        defered.resolve(videosFromChannel);
                    });
                }
            });
            return defered.promise;
        }

	}
})();