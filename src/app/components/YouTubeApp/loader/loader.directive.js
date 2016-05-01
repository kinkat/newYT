(function(window){
    "use strict";

    angular.module('newYt')
    .directive("loader", loader);

        function loader(){
            return {
                restrict: "A",
                link: function($scope, element){
                    $scope.$on("loader_show", function () {
                        console.log('loader_show', element);
                        return element.addClass("spinner");
                        
                    });
                    $scope.$on("loader_hide", function () {
                        return element.removeClass('spinner');
                    });
                }
            }
        }    

})();