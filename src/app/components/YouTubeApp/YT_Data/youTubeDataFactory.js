/*global gapi */

(function(){
	"use strict";

	angular.module('newYt')
	.factory("YouTubeFactory", YouTubeFactory);
    YouTubeFactory.$inject = ['$http','$q'];

		function YouTubeFactory($http, $q) {
		var objYT = {
			inputSearch: inputSearch,
			getVideosFromChannel: getVideosFromChannel,
            getMySubscriptions: getMySubscriptions,
            getVideoDuration:getVideoDuration
		};
		return objYT ;

		///////////////////////////////////// FUNCTIONS
		function inputSearch(query, pageToken) {
            var defere = $q.defer();
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
                    part: "snippet, contentDetails",
                    playlistId: uploads,
                    maxResults:15,
                    pageToken: pageToken
                    });
                    requestToExtractVideos.execute(function(videosFromChannel){
                      console.log(videosFromChannel);

                        defered.resolve(videosFromChannel);
                    });
                }
            });
            return defered.promise;
        }

        function getVideoDuration(clickedVideoId){
          var videoId = clickedVideoId,
              defered = $q.defer();

          var requestToExtractVideos = gapi.client.youtube.videos.list({
              part: "contentDetails",
              id: videoId
              });

          requestToExtractVideos.execute(function(videosFromChannel){
                      defered.resolve(videosFromChannel);
                    });
            return defered.promise;
        }

	}
})();
