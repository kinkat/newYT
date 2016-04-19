(function(){
    "use strict";

    angular.module("newYt")
    .directive("youtubePlayer", function($window, ytPlayerAPI){
            var player;
        return{
            restrict: "E",
            template: "<div id='ytplayer'></div>",
            scope: {
                  height:   "@",
                  width:    "@",
                  videoid:  "@"  
                },
            link: function(scope, element, attrs) {
                  
                    player = new YT.Player(element.children()[0], {
                      playerVars: {
                        autoplay: 1,
                        html5: 1,
                        theme: "light",
                        modesbranding: 0,
                        color: "white",
                        iv_load_policy: 3,
                        showinfo: 1,
                        controls: 1
                    },

                      height: scope.height,
                      width: scope.width,
                      videoId: scope.videoid, 
                    });
                  

                  scope.$watch('videoid', function(newValue, oldValue) {
                    if (newValue == oldValue) {
                      return;
                    }

                    player.cueVideoById(scope.videoid);

                  }); 

                  scope.$watch('height + width', function(newValue, oldValue) {
                    if (newValue == oldValue) {
                      return;
                    }

                    player.setSize(scope.width, scope.height);

                  });
                }   
        };
    })

})();