(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController);

        MainController.$inject = ['YouTubeFactory', 'toastr', '$sce', '$q', 'AuthService', '$anchorScroll', '$log', '$window','$routeParams','$location','cacheService','$scope','httpInterceptor'];

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
            }else{
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
                    console.log('channel',data.items);
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
            // $anchorScroll();
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
