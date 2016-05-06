/*global YT */

(function(){
    "use strict";

    angular.module("newYt")
    .directive("youtubePlayer", function(cacheService){
        var player,
            i = 0;

        //console.log(myFavorite);
        return{
            restrict: "E",
            template: "<div class='embed-responsive-item' id='ytplayer'></div>",
            scope:{
                  height:   "@",
                  width:    "@",
                  videoid:  "@"
            },
            link: function(scope, element) {

                  player = new YT.Player(element.children()[0], {
                    playerVars: {
                      autoplay: 1,
                      html5: 1,
                      theme: "light",
                      modesbranding: 0,
                      color: "red",
                      iv_load_policy: 3,
                      showinfo: 1,
                      controls: 1
                    },
                    events: {
                      'onStateChange': playNextVideo
                    },
                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid
                  });

                  scope.$watch('videoid', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                      return;
                    }
                    player.cueVideoById(scope.videoid);
                    player.playVideo();
                  });

                  scope.$watch('height + width', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                      return;
                    }
                    player.setSize(scope.width, scope.height);
                  });

                function playNextVideo(event) {
                    if(event.data == YT.PlayerState.ENDED){
                        var myFavorite = cacheService.getCachedData('favorite');
                        if(myFavorite.length > 0) {
                        (i === myFavorite.length - 1) ? i=0 : i++;
                            player.cueVideoById(myFavorite[i].id);
                            player.playVideo();
                            scope.videoid = myFavorite[i].id;
                        }
                    }
                }
            }
        };
    });
})();
