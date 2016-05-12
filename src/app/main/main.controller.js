(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController);

        MainController.$inject = ['YouTubeFactory', 'toastr', '$sce', '$q', 'AuthService', '$anchorScroll',
        '$log', '$window','$routeParams','$location','cacheService','$scope','httpInterceptor', '$cookies', 'helpersService'];

    function MainController(YouTubeFactory, toastr, $sce, $q, AuthService, $anchorScroll, $log, $window, $routeParams,
      $location, cacheService, $scope, httpInterceptor, $cookies, helpersService) {
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
        vm.currentChannelTitle = $routeParams.query;

        vm.getMoreData = getMoreData;
        vm.busy = true;
        vm.subscriptionsArray = [];
        vm.getChannelVideos = getChannelVideos;
        vm.authorizeUser = authorizeUser;
        vm.playClickedVideo = playClickedVideo;
        vm.search = search;
        vm.showToastr = showToastr;
        vm.showMySubscription = showMySubscription;
        vm.trustSrc = trustSrc;
        vm.trustTitle = trustTitle;
        vm.showChannelVideos = showChannelVideos;
        vm.yt = {
            videoid: false
        };
        vm.nextPageToken = '';
        vm.prevPageToken  = '';

        vm.addClickedVideo = addClickedVideo;
        vm.contentDetails = [];
        vm.clickedVideoObj = {};
        vm.allFavorite = [];
        vm.allFavoriteFromCache = [];
        vm.currentVideoTitle;
        vm.playFavorite = playFavorite;
        vm.getPlaylistDuration = getPlaylistDuration;
        vm.time;
        vm.totalseconds;
        vm.videosDuration = 0;
        vm.buttonFlag = true;
        vm.timerFlag = false;
        vm.refreshPlaylist = refreshPlaylist;

        init();

        function init () {
            var page = $routeParams.page,
                query= $routeParams.query;
            afterAuthorization(AuthService.initGapiClient());
            vm.subscriptionsArray = cacheService.getCachedData('mySub');

            switch(page){
                case 'search':
                    vm.responseArray = cacheService.getCachedData('search');
                    vm.busy = false;
                    break;

                case 'subscriptions':
                    vm.responseArray = cacheService.getCachedData($routeParams.query);
                    vm.busy = false;
                    if(vm.responseArray.length === 0){
                        vm.busy = true;
                        getChannelVideos(query);
                    }

                    break;
                default:
                    break;
            }

        }

        function search(){
            vm.responseArray = [];
            YouTubeFactory.inputSearch(vm.searchInput)
                .then(function(data){
                    vm.nextPageToken = cacheService.saveVideos('nextPage', data.nextPageToken)
                    vm.responseArray = data.items;
                    cacheService.saveVideos('search', data.items);
                })
                .then(function(){
                    vm.busy = false;
                    $location.path('/search/' + vm.searchInput);
                });

        }

        function getMoreData(){
            if (vm.busy) {
                return;
            }
            vm.busy = true;
            vm.showPlayer = false;
            var page = $routeParams.page,
                query = $routeParams.query,
                promise;

            vm.nextPageToken = cacheService.getCachedData('nextPage');
            vm.prevPageToken = cacheService.getCachedData('prevPage');

            switch(page){
                case 'search':
                    promise = YouTubeFactory.inputSearch(query, vm.nextPageToken);
                    break;
                case 'subscriptions':
                    promise = YouTubeFactory.getVideosFromChannel(query, vm.nextPageToken);
                    break;
                default:
                    break;
            }

            promise.then(function(data){
                vm.nextPageToken = cacheService.saveVideos('nextPage', data.nextPageToken);
                vm.prevPageToken = cacheService.saveVideos('prevPage', data.prevPageToken);
                angular.forEach(data.items, function(item){
                    if(angular.isUndefined(vm.responseArray)){
                        vm.responseArray = [];
                    }
                    vm.responseArray.push(item);
                })
                cacheService.saveVideos('search', vm.responseArray);
            })
            .then(function(){
                vm.busy = false;
            });

        }

        function showMySubscription() {
            vm.showChannels = true;

            if(!vm.subscriptionsArray.length){
                YouTubeFactory.getMySubscriptions()
                    .then(function(data){
                        vm.subscriptionsArray = data;
                        cacheService.saveVideos('mySub', data);
                    })
                    .then(function(){
                        vm.loggedUserName = AuthService.userInfo();
                    });
            } else {
                return ;
            }
        }

        function showChannelVideos(channel){
            var channelTitle = channel.title ? channel.title : channel;
            $location.path("/subscriptions/" + channelTitle);

        }

        function getChannelVideos(channelTitle){
            channelTitle = channelTitle.title ? channelTitle.title : channelTitle;
            vm.nextPageToken = '';
            cacheService.removeData('nextPage');
            vm.responseArray = [];

            YouTubeFactory.getVideosFromChannel(channelTitle)
                .then(function(data){
                    vm.responseArray = data.items;
                    vm.nextPageToken = data.nextPageToken;
                    cacheService.saveVideos('nextPage', data.nextPageToken);
                    cacheService.saveVideos(channelTitle, data.items);

                }).then(function(){
                    vm.busy = false;
                })
        }

        function afterAuthorization (defered) {
            defered
            .then(function () {
                vm.showLoginButton = false;
                vm.loginStatus = true;
                showMySubscription();
            }, function () {
                vm.showLoginButton = true;
                vm.loginStatus = false;
                vm.subscriptionsArray = [];
            });
        }

        function authorizeUser(){
            var defered = $q.defer();
            AuthService.checkAuth(defered, true);
            afterAuthorization(defered.promise);
        }

        function playClickedVideo(clickedVideo) {

          vm.yt.videoid = extractVideoId(clickedVideo);
          vm.showPlayer = true;
          refreshPlaylist();
        }

        function addClickedVideo(clickedVideo) {

            vm.clickedVideoObj = new Object();

            vm.movieId = extractVideoId(clickedVideo);
            vm.clickedVideoObj["thumbnail"] = clickedVideo.snippet.thumbnails.default.url;
            vm.clickedVideoObj["title"] = clickedVideo.snippet.title;
            vm.clickedVideoObj["id"] = vm.movieId;
            vm.currentVideoTitle = clickedVideo.snippet.title;
            vm.allFavorite.push(vm.clickedVideoObj);

            YouTubeFactory.getVideoDuration(vm.movieId)
            .then(function(clickedVideo){
                vm.time = clickedVideo.items[0].contentDetails.duration;
                var converted = helpersService.convertDurationToSeconds(vm.time);
                return vm.clickedVideoObj["duration"] = converted;
                console.log(vm.videosDuration);

            }).then(function(){
                cacheService.saveVideos('favorite', vm.allFavorite);
                vm.allFavoriteFromCache = cacheService.getCachedData('favorite');
            })
        }

        function getPlaylistDuration(videos) {
            angular.forEach(videos, function(value, key){
                vm.videosDuration = vm.videosDuration + value.duration;
                cacheService.saveTotalDuration('totalDur', vm.videosDuration);
                cacheService.saveTotalDuration('fixDur', vm.videosDuration);
             })
        }

        function playFavorite() {

          if (vm.allFavoriteFromCache.length > 0) {
              vm.allFavoriteFromCache = cacheService.getCachedData('favorite');
              vm.videosDuration = 0;
              getPlaylistDuration(vm.allFavoriteFromCache);
              vm.buttonFlag = false;
              vm.timerFlag = true;
              vm.yt.videoid = vm.allFavoriteFromCache[0].id;
          }
          else {
            toastr.info('Wybierz utwory do playlisty, klikając przycisk Add');
          }

        }

        function refreshPlaylist() {
            vm.buttonFlag = true;
            vm.timerFlag = false;
            vm.allFavoriteFromCache.length = 0;
            vm.videosDuration = 0;
        }

        function trustSrc(src) {
            var link = 'https://www.youtube.com/embed/' + src;
            return $sce.trustAsResourceUrl(link);
        }

        function trustTitle(src) {
            return $sce.trustAsResourceUrl(src);
        }

        function extractVideoId(video){
            if (angular.isObject(video.id)){
                return video.id.videoId;
            }
            if (angular.isObject(video.snippet.resourceId)){
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
