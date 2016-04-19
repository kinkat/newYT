(function(){
    "use strict";

    angular
    .module("newYt")
    .directive("youtubePlayerContainer", youtubePlayerContainer);

    youtubePlayerContainer.$inject = ['ytPlayerAPI'];

    function youtubePlayerContainer (ytPlayerAPI){

        return {
            restrict: "E",
            templateUrl: '/app/components/YouTubeApp/player-container.html',
            controller: youtubeContainerController,
            controllerAs: 'youtubeContainerCtrl'
        }

        function youtubeContainerController(){
            var vm = this;
            vm.apiReady = false;

            ytPlayerAPI.onReady()
                .then(function(){
                    vm.apiReady = true;
                    console.log("API IS READY");

                });
        }
    }

})();