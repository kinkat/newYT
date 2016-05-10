(function(){
    "use strict";

    angular
    .module("newYt")
    .directive("youtubePlayerContainer", youtubePlayerContainer);

    youtubePlayerContainer.$inject = ['ytPlayerAPI'];

    function youtubePlayerContainer (ytPlayerAPI){

        return {
            restrict: "E",
            templateUrl: '/app/components/YouTubeApp/YT_Player/player-container.html',
            controller: youtubeContainerController,
            controllerAs: 'youtubeContainerCtrl'
        }

        function youtubeContainerController(){
            var vm = this;
            vm.apiReady = false;
            vm.currentTime;
            vm.totalTime = 0;

            ytPlayerAPI.onReady()
                .then(function(){
                    vm.apiReady = true;
                });
        }
    }

})();
