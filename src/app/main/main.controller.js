(function () {

    'use strict';

    angular
        .module('newYt')
        .controller('MainController', MainController );

  /** @ngInject */
    function MainController (YouTubeFactory, toastr, $sce) {
        var vm = this;
        vm.searchInput = "";

        vm.search = search;
        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1460374566702;
        vm.showToastr = showToastr;
        vm.responseArray = [];
        vm.trustSrc = trustSrc;
        vm.trustTitle = trustTitle;
        vm.playClickedVideo = playClickedVideo;
        vm.showMySubscription = showMySubscription;
        vm.videoIdToPlayOnFrame = "";
        vm.subscriptionsArray = [];
        vm.showPlayer = false;
        vm.showChannels = false;

        vm.authorizeUserFunction = authorizeUserFunction;

	    function authorizeUserFunction(){
	    	checkAuth();
	    }

        function search(){
            vm.responseArray = [];
            YouTubeFactory.inputSearch({
                part:"snippet",
                key: 'AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0',
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
	    	vm.subscriptionsArray = [];
            vm.showChannels = true;

            var request = gapi.client.youtube.subscriptions.list({
                part: "snippet",
                mine: true,
                maxResults:10
            });
            request.execute(function (data) {  
                angular.forEach(data.items, function(items, index){
                    vm.subscriptionsArray.push(items.snippet);
                })
                    console.log(vm.subscriptionsArray);
                return vm.subscriptionsArray;
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
            vm.videoIdToPlayOnFrame = trustSrc(clickedVideo.id.videoId);
            vm.showPlayer = true;
        }

        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }
    }

})();
