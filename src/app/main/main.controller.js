(function() {
  'use strict';

  angular
    .module('newYt')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(YouTubeFactory , $timeout, webDevTec, toastr) {
	 var vm = this;
	    vm.searchInput = "";

	    vm.search = search;
	    vm.awesomeThings = [];
	    vm.classAnimation = '';
	    vm.creationDate = 1460374566702;
	    vm.showToastr = showToastr;
	    vm.responseArray = [];

	    // function activate() {
	    //       console.log("YT API IS READY");
	    // }
	    function search(){

	          YouTubeFactory.initFactory({
	          part:"snippet",
	          key: 'AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0',
	          q: vm.searchInput
	          }).success(function(data){
	            console.log(data);
	          });
	      console.log(vm.responseArray);


	    }

	    function showToastr() {
	      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
	      vm.classAnimation = '';
	    }

  }
})();
