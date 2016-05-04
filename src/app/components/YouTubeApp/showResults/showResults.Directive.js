(function(){
    'use strict';

    angular
        .module('newYt')
        .directive('showResults', showResults);

    function showResults() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/YouTubeApp/showResults/showResults.html'
            };

    }

})();