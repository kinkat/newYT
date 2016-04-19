(function(){
  "use strict";

  angular.module('newYt')
  .service('AuthService', AuthService);

  function AuthService($q){

    var vm = this;
    vm.googleApiClientReady = googleApiClientReady;
    vm.checkAuth = checkAuth;
    vm.handleAuthResult = handleAuthResult;
    vm.loadAPIClientInterfaces = loadAPIClientInterfaces;
    vm.OnLoadGAPI = OnLoadGAPI;
    vm.handleAPILoaded = handleAPILoaded;
    vm.logged = false;
    vm.userName = "";
    var defered = $q.defer();

    var apiKey = 'AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0';
    var OAUTH2_CLIENT_ID = '612748501974-u1vf3nnont10d4u6po1n17imrv7n8e5h.apps.googleusercontent.com';
    var OAUTH2_SCOPES = [
      'https://www.googleapis.com/auth/youtube'
    ];
    
    // Upon loading, the Google APIs JS client automatically invokes this callback.
    function googleApiClientReady()  {
      gapi.client.setApiKey(apiKey);

      gapi.auth.init(function() {
        window.setTimeout(checkAuth, 1);
      });
    }
    // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
    // If the currently logged-in Google Account has previously authorized
    // the client specified as the OAUTH2_CLIENT_ID, then the authorization
    // succeeds with no user intervention. Otherwise, it fails and the
    // user interface that prompts for authorization needs to display.
    function checkAuth() {
      gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false,
          // output: "embed"
      }, handleAuthResult);
    }

    // Handle the result of a gapi.auth.authorize() call.
    function handleAuthResult(authResult) {
        console.log("authorization", authResult);
      if (authResult && !authResult.error) {
          vm.logged = true;
          // Authorization was successful. Hide authorization prompts and show
          // content that should be visible after authorization succeeds.
          $('.pre-auth').hide();
          $('.post-auth').show();
          defered.resolve(vm.logged);
          loadAPIClientInterfaces();
      } else {
        vm.logged = false;
          defered.resolve(vm.logged);

        // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
        // client flow. The current function is called when that flow completes.
        // $('#login-link').click(function() {
          gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: false
            }, handleAuthResult);
        // });
      }
      
    }

    // Load the client interfaces for the YouTube Analytics and Data APIs, which
    // are required to use the Google APIs JS client. More info is available at
    // http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
    function loadAPIClientInterfaces() {
      //console.log("interface");
      gapi.client.load('youtube', 'v3', function() {
        handleAPILoaded();
      })
    }

    function OnLoadGAPI() {
      //console.log("gapi on load");
      googleApiClientReady();
    }

    function handleAPILoaded () {
        var request = gapi.client.youtube.channels.list({
              mine: true,
              part: 'snippet'
            });
            request.execute(function (data) {  
                vm.userName = data.items[0].snippet.title;
            console.log(vm.userName);
            });
            
      return defered.promise ;
    }

  }

})();