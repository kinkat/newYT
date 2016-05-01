(function(){
    var tag = document.createElement('script');
    tag.src = "https://apis.google.com/js/client.js?onload=OnLoadCallback";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.OnLoadCallback = function () {
        gapi.client.load('youtube', 'v3', function() {
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['newYt']);
            });
        });
    }

})();


