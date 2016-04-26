(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController);

        MainController.$inject = ['YouTubeFactory', 'toastr', '$sce', '$q', 'AuthService', '$anchorScroll', '$log', '$window','$routeParams','$location','cacheService'];

  /** @ngInject */
    function MainController(YouTubeFactory, toastr, $sce, $q, AuthService, $anchorScroll, $log, $window, $routeParams, $location, cacheService) {
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
        vm.currentChannelId = $routeParams.id;
        vm.searchNext = searchNext;
        vm.searchPrev = searchPrev;
        vm.busy = false;

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
        init();

        function init () {

            vm.subscriptionsArray = cacheService.getVideos('mySub');
            afterAuthorization(AuthService.initGapiClient());

            if(angular.isUndefined($routeParams.id)){
                vm.responseArray = cacheService.getVideos('search');

            }else{
                showChannelVideos($routeParams.id);
                vm.responseArray = cacheService.getVideos($routeParams.id);
            }           
        }

        function search(){
            vm.responseArray = [];

            YouTubeFactory.inputSearch(vm.searchInput)
                .then(function(data){
                    vm.nextPageToken = cacheService.saveVideos('nextPage', data.nextPageToken)
                    vm.responseArray = data.items;
                    cacheService.saveVideos('search', vm.responseArray);
                })
                .then(function(){
                    $location.path('/');
                });

        }


        function searchNext(){
            vm.showPlayer = false;
            if (vm.busy) return;
            vm.busy = true;

            vm.nextPageToken = cacheService.getVideos('nextPage');
            vm.prevPageToken = cacheService.getVideos('prevPage');

            YouTubeFactory.inputSearch(vm.searchInput, vm.nextPageToken)
                .then(function(data){
                    vm.nextPageToken = cacheService.saveVideos('nextPage', data.nextPageToken);
                    vm.prevPageToken = cacheService.saveVideos('prevPage', data.prevPageToken);
                    angular.forEach(data.items, function(item){
                        vm.responseArray.push(item);
                    })
                    cacheService.saveVideos('search', vm.responseArray);
                })
                .then(function(){
                    vm.busy = false;
                });

        }

        function searchPrev(){
            vm.responseArray = [];
            console.log('jestem w search next');
                vm.nextPageToken = cacheService.getVideos('nextPage');
                vm.prevPageToken = cacheService.getVideos('prevPage');

            YouTubeFactory.inputSearch(vm.searchInput, vm.prevPageToken)
                .then(function(data){
                    vm.nextPageToken = cacheService.saveVideos('nextPage', data.nextPageToken)
                    vm.prevPageToken = cacheService.saveVideos('prevPage', data.prevPageToken)
                    vm.responseArray = data.items;
                    cacheService.saveVideos('search', vm.responseArray);
                })
                .then(function(){
                    $location.path('/');
                });

        }

        function showMySubscription() {
            vm.subscriptionsArray = [];
            vm.showChannels = true;

            YouTubeFactory.getMySubscriptions()
                .then(function(data){
                    vm.subscriptionsArray = data;
                    cacheService.saveVideos('mySub', data);
                        
                })
                .then(function(){
                    vm.loggedUserName = AuthService.userInfo();
                });
        }

        function showChannelVideos(channel){
            var channelTitle = channel.title ? channel.title : channel;
            vm.responseArray = [];

            YouTubeFactory.getVideosFromChannel(channel)
                .then(function(data){
                    vm.responseArray = data;
                    cacheService.saveVideos(channelTitle, data);
                    $location.path("/"+ channelTitle);
                });

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
