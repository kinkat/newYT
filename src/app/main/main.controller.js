(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController )

  /** @ngInject */
    function MainController (YouTubeFactory, toastr, $sce, $q, AuthService) {
        var vm = this;
        vm.searchInput = "";
        vm.search = search;
        vm.awesomeThings = [];
        vm.classAnimation = "";
        vm.creationDate = 1460374566702;
        vm.showToastr = showToastr;
        vm.loggedUserName = "";
        vm.responseArray = [];
        vm.trustSrc = trustSrc;
        vm.trustTitle = trustTitle;
        vm.playClickedVideo = playClickedVideo;
        vm.showMySubscription = showMySubscription;
        vm.videoIdToPlayOnFrame = "";
        vm.subscriptionsArray = [];
        vm.authorizeUserFunction = authorizeUserFunction;
        vm.showPlayer = false;
        vm.showChannels = true;

        vm.logged = arguments[4].logged;

        vm.afterAuth = false; 
        vm.subscriptionsArray = YouTubeFactory.readCache();
        
        vm.afterAuth = YouTubeFactory.readFlag();
        vm.showChannelVideos = showChannelVideos;
        vm.yt = {
            width: 720, 
            height: 480, 
            videoid: false,
        };

        // vm.showUserInformation = showUserInformation;
        vm.idtest = "";
        vm.player = {};
        function showChannelVideos(channel){
            var channelTitle = channel.title;
            var defered = $q.defer();

            var request = gapi.client.youtube.channels.list({
                part: "contentDetails",
                forUsername: channelTitle,
            });
            request.execute(function (data) {  
            	console.log(data);
                var uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
                var request = gapi.client.youtube.playlistItems.list({
                part: "snippet,contentDetails",
                playlistId: uploads,
                });

                request.execute(function(videosFromChannel){
                    vm.responseArray = videosFromChannel.items;
                    // console.log("videos arr", vm.responseArray);

                    YouTubeFactory.writeCache(vm.responseArray);
                    defered.resolve(vm.responseArray);
                })

            });
            defered.promise.then(function(data){
                vm.responseArray = data;
            })
        }

	    function authorizeUserFunction(){
	    	AuthService.checkAuth();
            vm.afterAuth = true;
            YouTubeFactory.writeFlag(vm.afterAuth);
	    }

        function search(){
            vm.responseArray = [];

						// var request = gapi.client.youtube.search.list({
						// part: "snippet,contentDetails",
						// q: vm.searchInput,
						// });

						// request.execute(function(videosFromChannel){
						//     vm.responseArray = videosFromChannel.items;
						//     console.log("search arr", vm.responseArray);

						//     // YouTubeFactory.writeCache(vm.responseArray);
						//     // defered.resolve(vm.responseArray);
						// })
            YouTubeFactory.inputSearch({
                part:"snippet",
                key: "AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0",
                maxResults: 10,
                q: vm.searchInput
            })
            .success(function (data) {
            	console.log(data);
            	    angular.forEach(data.items, function(data, index) {
                        vm.responseArray.push(data);
            	   });
            })
            vm.showPlayer = false;
        }

        function showMySubscription() {
            vm.showChannels = true;
            var defere = $q.defer();
            var request = gapi.client.youtube.subscriptions.list({
                part: "snippet",
                mine: true,
                maxResults:10
            });
            request.execute(function (data) {  
                angular.forEach(data.items, function(items, index){
                    vm.subscriptionsArray.push(items.snippet);
                    defere.resolve(vm.subscriptionsArray);
                });
                YouTubeFactory.writeCache(vm.subscriptionsArray); 
            });
            defere.promise.then(function(arr){
                vm.subscriptionsArray = arr;
            });
        }

        function showUserInformation(){
            var request = gapi.client.youtube.channels.list({
              mine: true,
              part: 'snippet'
            });
            request.execute(function (data) {  
                angular.forEach(data.items, function(items, index){
                })
            });
        }

        function trustSrc(src) {
            var link = 'https://www.youtube.com/embed/' + src;
            return $sce.trustAsResourceUrl(link);
        }

            function trustTitle(src) {
            return $sce.trustAsResourceUrl(src);
        }

        function playClickedVideo(clickedVideo) {
            // vm.videoIdToPlayOnFrame = trustSrc(clickedVideo.id.videoId);
            vm.showPlayer = true;
            vm.yt.videoid = clickedVideo.id.videoId;
            console.log(vm.yt.videoid);
        }

        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }
    }

})();
