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

	    function search(){

	          YouTubeFactory.initFactory({
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

	    vm.trustSrc = function(src) {
	    	console.log("jestem w funkcji trustSrc");

	    	var link = 'https://www.youtube.com/embed/' + src;
    		return $sce.trustAsResourceUrl(link);
  		}

	    function showToastr() {
	      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
	      vm.classAnimation = '';
	    }

  }
})();
