(function(){
    // LOAD FIREBASE API
    var tag1 = document.createElement('script');
    tag1.src = "https://cdn.firebase.com/js/client/2.2.1/firebase.js";
    var firstScriptTag1 = document.getElementsByTagName('script')[0];
    firstScriptTag1.parentNode.insertBefore(tag1, firstScriptTag1);

    //LOAD ANGULAR FIRE API

    var tag2 = document.createElement('script');
    tag2.src = "https://cdn.firebase.com/libs/angularfire/1.0.0/angularfire.min.js";
    var firstScriptTag2 = document.getElementsByTagName('script')[1];
    firstScriptTag2.parentNode.insertBefore(tag2, firstScriptTag2);

    //LOAD GOOGLE API CLIENT

    var tag3 = document.createElement('script');
    tag3.src = "https://apis.google.com/js/client.js?onload=OnLoadCallback";
    var firstScriptTag3 = document.getElementsByTagName('script')[2];
    firstScriptTag3.parentNode.insertBefore(tag3, firstScriptTag3);



    window.OnLoadCallback = function () {
        gapi.client.load('youtube', 'v3', function() {
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['newYt']);
            });
        });
    }

})();


