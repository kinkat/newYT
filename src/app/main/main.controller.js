(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController);

        MainController.$inject = ['YouTubeFactory', 'toastr', '$sce', '$q', 'AuthService', '$anchorScroll', '$log', '$window','$routeParams','$location', '$cacheFactory', 'cacheService'];

  /** @ngInject */
    function MainController(YouTubeFactory, toastr, $sce, $q, AuthService, $anchorScroll, $log, $window, $routeParams, $location, $cacheFactory, cacheService) {
        var vm = this;
        vm.awesomeThings = [];
        vm.classAnimation = "";
        vm.creationDate = 1460374566702;
        vm.loggedUserName = "";
        vm.responseArray = [];
        vm.searchInput = "";
        vm.showChannels = true;
        vm.showLoginButton = false;
        vm.loginStatus = false;
        vm.showPlayer = false;

        vm.videoIdToPlayOnFrame = "";
        vm.authorizeUser = authorizeUser;
        vm.playClickedVideo = playClickedVideo;
        vm.search = search;
        vm.showToastr = showToastr;
        vm.showMySubscription = showMySubscription;

        vm.trustSrc = trustSrc;
        vm.trustTitle = trustTitle;
        vm.userName = "Aaaareeeeek";
        vm.currentChannelId = $routeParams.id;

        vm.showChannelVideos = showChannelVideos;
        vm.yt = {
          videoid: false
        };

        init();

        function init () {
            vm.subscriptionsArray = YouTubeFactory.showSubscribedChannel();
            afterAuthorization(AuthService.initGapiClient());
            vm.userName = AuthService.userInfo();

            if(angular.isUndefined($routeParams.id)){
                vm.responseArray = YouTubeFactory.readCache();
            }else{
                vm.responseArray = cacheService.getVideos($routeParams.id);
            }           
        }

        function search(){
            vm.responseArray = [];

            YouTubeFactory.inputSearch({
                part:"snippet",
                key: "AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0",
                maxResults: 10,
                type: 'video',
                q: vm.searchInput
            })
            .success(function (data) {
                angular.forEach(data.items, function(data, index) {
                    vm.responseArray.push(data);
                });
            })
            vm.showPlayer = false;
            $location.path("/");
        }

        function showMySubscription() {
            vm.subscriptionsArray = [];
            vm.showChannels = true;
            var defere = $q.defer(),
                request = gapi.client.youtube.subscriptions.list({
                    part: "snippet",
                    mine: true,
                    maxResults:10
                });
            request.execute(function (data) {
                angular.forEach(data.items, function(items){
                    vm.subscriptionsArray.push(items.snippet);
                    defere.resolve(vm.subscriptionsArray);
                });
                YouTubeFactory.writeSubscribedChannel(vm.subscriptionsArray);
            });
            defere.promise.then(function(arr){
                vm.subscriptionsArray = arr;
                console.log(vm.subscriptionsArray);
            });
        }


        function showChannelVideos(channel){
            var channelTitle = channel.title;
            var defered = $q.defer();

            var request = gapi.client.youtube.channels.list({
                part: "contentDetails",
                forUsername: channelTitle
            });
            request.execute(function (data) {
                var uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
                var requestToExtractVideos = gapi.client.youtube.playlistItems.list({
                part: "snippet,contentDetails",
                playlistId: uploads,
                maxResults:10
                });
                requestToExtractVideos.execute(function(videosFromChannel){
                    vm.responseArray = videosFromChannel.items;

                    console.log(vm.responseArray);
                    cacheService.saveVideos(vm.responseArray[0].snippet.channelTitle, vm.responseArray);
                    // YouTubeFactory.writeCache(vm.responseArray);
                    // YouTubeFactory.writeChannelCache(vm.responseArray);
                    defered.resolve(vm.responseArray);
                })
            });
            defered.promise.then(function(data){
                vm.responseArray = data;

                $location.path("/"+channelTitle);
            })
        }

        function afterAuthorization (defered) {
            // $log.debug(" defered in after auth", defered);
            defered
            .then(function () {
                vm.showLoginButton = false;
                vm.loginStatus = true;
                // $log.debug("auth done");
            }, function () {
                vm.showLoginButton = true;
                vm.loginStatus = false;
                vm.subscriptionsArray = [];
                // $log.debug("auth fail");
            });
        }

        function authorizeUser(){
            var defered = $q.defer();
            AuthService.checkAuth(defered, true);
            afterAuthorization(defered.promise).then(
            showMySubscription());
        }

        // function logOut(){
        //     AuthService.logOut();
        // }

        
        function playClickedVideo(clickedVideo) {
            vm.yt.videoid = extractVideoId(clickedVideo);
            vm.showPlayer = true;
            $log.debug("my videoid: ",vm.yt.videoid);
            $log.debug(clickedVideo);
            $anchorScroll();
        }

        function trustSrc(src) {
            var link = 'https://www.youtube.com/embed/' + src;
            return $sce.trustAsResourceUrl(link);
        }

        function trustTitle(src) {
            return $sce.trustAsResourceUrl(src);
        }

        function extractVideoId(video){
            if(angular.isObject(video.id)){
                return video.id.videoId;
            }
            if(angular.isObject(video.snippet.resourceId)){
                return video.snippet.resourceId.videoId;
            }
            return "no_ID";
        }


        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }
    }

})();
