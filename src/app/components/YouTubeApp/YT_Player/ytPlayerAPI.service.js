(function(){
    "use strict";

    angular
        .module("newYt")
        .service("ytPlayerAPI", ytPlayerAPI);

        ytPlayerAPI.$inject = ['$q', '$window'];
        function ytPlayerAPI($q, $window){
            var apiReady = $q.defer();

            activate();

            this.onReady = onReady;

            function onReady(){
                return apiReady.promise;
            }

            function activate(){
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                $window.onYouTubeIframeAPIReady = function() {
                  apiReady.resolve();
                  // API Loaded
                }
            }
        }

})();
