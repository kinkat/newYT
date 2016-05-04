
(function(){
	"use strict";

	angular.module("newYt")
	.directive("inputDirective", function(){
		return{
			restrict: "E",
			templateUrl: "app/components/YouTubeApp/input/inputTemplate.html"
		};
	})

})();