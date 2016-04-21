(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController);

        MainController.$inject = ['YouTubeFactory', 'toastr', '$sce', '$q', 'AuthService', '$anchorScroll', '$log', '$window'];

  /** @ngInject */
    function MainController(YouTubeFactory, toastr, $sce, $q, AuthService, $anchorScroll, $log, $window) {
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
        vm.subscriptionsArray = [];
        vm.videoIdToPlayOnFrame = "";

        vm.authorizeUser = authorizeUser;
        // vm.logOut = logOut;
        vm.playClickedVideo = playClickedVideo;
        vm.search = search;
        vm.showToastr = showToastr;
        vm.showMySubscription = showMySubscription;
        vm.subscriptionsArray = YouTubeFactory.readCache();
        vm.trustSrc = trustSrc;
        vm.trustTitle = trustTitle;
        vm.userName = "Aaaareeeeek";

        vm.showChannelVideos = showChannelVideos;
        vm.yt = {
          width: 1280,
          height: 1024,
          videoid: false
        };

        init();

        function init () {
            afterAuthorization(AuthService.initGapiClient());
            vm.userName = AuthService.userInfo();
            $log.debug(vm.userName);
            console.log(window.screen.width);
            console.log(window.screen.width);
            
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
                    YouTubeFactory.writeCache(vm.responseArray);
                    defered.resolve(vm.responseArray);
                })
            });
            defered.promise.then(function(data){
                vm.responseArray = data;
            })
        }

        function afterAuthorization (defered) {
            $log.debug(" defered in after auth", defered);
            defered
            .then(function () {
                vm.showLoginButton = false;
                vm.loginStatus = true;
                $log.debug("auth done");
            }, function () {
                vm.showLoginButton = true;
                vm.loginStatus = false;
                $log.debug("auth fail");
            });
        }

        function authorizeUser(){
            var defered = $q.defer();
            AuthService.checkAuth(defered, true);
            afterAuthorization(defered.promise);
        }

        // function logOut(){
        //     AuthService.logOut();
        // }

        function search(){
            console.log('asdasdas');
            vm.responseArray = [];
            YouTubeFactory.inputSearch({
                part:"snippet",
                key: "AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0",
                maxResults: 10,
                q: vm.searchInput
            })
            .success(function (data) {
                angular.forEach(data.items, function(data, index) {
                    vm.responseArray.push(data);
                });
            })
            vm.showPlayer = false;
        }

        function showMySubscription() {
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
                YouTubeFactory.writeCache(vm.subscriptionsArray);
            });
            defere.promise.then(function(arr){
                vm.subscriptionsArray = arr;
            });
        }

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
