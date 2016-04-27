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
        vm.getMoreData = getMoreData;
        vm.busy = true;
        vm.subscriptionsArray = [];
        vm.getVideos = getVideos;
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

            if(vm.subscriptionsArray.length === 0){
                vm.subscriptionsArray = cacheService.getVideos('mySub');
            }
            afterAuthorization(AuthService.initGapiClient());
            if(angular.isUndefined($routeParams.id)){
                vm.responseArray = cacheService.getVideos('search');
            }else{
                vm.responseArray = cacheService.getVideos($routeParams.id);
                if(vm.responseArray.length === 0)
                getVideos($routeParams.id);
            }           
        }

        function search(){
            vm.busy = false;
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

        function getMoreData(){
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

        function showMySubscription() {
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
            $location.path("/"+ channelTitle);

        }

        function getVideos(channelTitle){
            YouTubeFactory.getVideosFromChannel(channelTitle)
                .then(function(data){
                    var channelTitle = data[0].snippet.channelTitle;
                    vm.responseArray = data;
                    cacheService.saveVideos(channelTitle, data);
                    return channelTitle;
                }).then(function(channelTitle){
                    
                });
        }

        function afterAuthorization (defered) {
            defered
            .then(function () {
                vm.showLoginButton = false;
                vm.loginStatus = true;
                 // if(vm.subscriptionsArray.length){
                showMySubscription();
                    // }
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
