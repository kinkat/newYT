(function() {
  'use strict';

  angular
    .module('newYt')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(YouTubeFactory, $timeout, webDevTec, toastr, $sce) {
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


	    function search(){
	    	vm.responseArray = [];
	        YouTubeFactory.inputSearch({
		        part:"snippet",
		        key: 'AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0',
		        maxResult: 10,
		        q: vm.searchInput
	        }).success(function(data){
	      	    angular.forEach(data.items, function(data, index) {
         			vm.responseArray.push(data);
        		});
        		console.log(vm.responseArray);
			});

	    }

	    function trustSrc (src) {
	    	var link = 'https://www.youtube.com/embed/' + src;
	    	return $sce.trustAsResourceUrl(link);
  		}

	    function trustTitle (src) {
    		return $sce.trustAsResourceUrl(src);
  		}

	    function showToastr() {
	      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
	      vm.classAnimation = '';
	    }


	    function playClickedVideo(clickedVideo) {
	    	vm.videoIdToPlayOnFrame = trustSrc(clickedVideo.id.videoId);

	    }
	    
	    function showMySubscription(){

	    }

  }
})();
