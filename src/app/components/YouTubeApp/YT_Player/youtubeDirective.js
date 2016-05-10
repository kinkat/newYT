/*global YT */

(function(){
    "use strict";

    angular.module("newYt")
    .directive("youtubePlayer", function(cacheService, $interval, helpersService){
        var player,
            i = 0,
            tempTime = {},
            currentVideoDuration;

        return {
            restrict: "E",
            template: "<div class='embed-responsive-item' id='ytplayer'></div>",
            scope:{
                  height:   "@",
                  width:    "@",
                  videoid:  "@"
            },
            require: '^youtubePlayerContainer',
            link: function(scope,  element, attrs, containerCtrl) {

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
                      'onReady' : initializeTimer,
                      'onStateChange': playNextVideo
                    },
                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid
                  });

                  function initializeTimer() {
                    updateTimerDisplay();

                    $interval.cancel(time_update_interval);

                    var time_update_interval = $interval(function() {
                      updateTimerDisplay();
                      updateTotalTimer();
                    }, 1000)
                  }

                  function updateTimerDisplay() {
                    if(player.getCurrentTime) {
                        containerCtrl.currentTime = helpersService.formatTime(player.getCurrentTime());
                    }
                  }

                  function updateTotalTimer() {
                    if(player.getCurrentTime) {
                        containerCtrl.totalTime = tempTime.totalDur - containerCtrl.currentTime;
                        containerCtrl.totalTime = helpersService.formatMinute(containerCtrl.totalTime);
                    }
                  }

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
                    var myFavorite = cacheService.getCachedData('favorite');
                    if(event.data == YT.PlayerState.ENDED){


                        if(myFavorite.length > 0) {
                        (i === myFavorite.length - 1) ? i=0 : i++;
                            player.cueVideoById(myFavorite[i].id);
                            player.playVideo();
                            scope.videoid = myFavorite[i].id;
                        }

                      tempTime.totalDur = tempTime.totalDur - currentVideoDuration;
                    }
                    if (event.data == YT.PlayerState.UNSTARTED) {
                        getTotalDuration();
                    }
                    if (event.data == YT.PlayerState.PLAYING) {
                        currentVideoDuration = helpersService.formatTime(player.getDuration());
                    }
                }

                  function getTotalDuration() {
                    tempTime = cacheService.getDuration();
                    containerCtrl.totalTime = tempTime.totalDur;
                }
            }
        };
    });
})();
