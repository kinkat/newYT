(function(){
  "use strict";

  angular.module('newYt')
  .service('AuthService', AuthService);

  function AuthService($q, $cookies, $timeout){

    var vm = this,
        apiKey = 'AIzaSyDOp0oHNkQQ3Xozrqv9xRFfi2w3HU8oDx0',
        OAUTH2_CLIENT_ID = '612748501974-u1vf3nnont10d4u6po1n17imrv7n8e5h.apps.googleusercontent.com',
        OAUTH2_SCOPES = [
          'https://www.googleapis.com/auth/youtube'
        ];
    vm.initGapiClient = initGapiClient;
    vm.checkAuth = checkAuth;
    vm.handleAuthResult = handleAuthResult;
    vm.handleAPILoaded = handleAPILoaded;
    vm.userInfo = userInfo; 
    vm.userName = "";

    // vm.loadAPIClientInterfaces = loadAPIClientInterfaces;
    // Upon loading, the Google APIs JS client automatically invokes this callback.
    function initGapiClient()  {
        var defered = $q.defer();
        // console.log("gapi",gapi);
        gapi.client.setApiKey(apiKey);

        gapi.auth.init(function() {
            $timeout(function () {
              checkAuth(defered);
            }, 1);
        });
        return defered.promise;
    }
    // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
    // If the currently logged-in Google Account has previously authorized
    // the client specified as the OAUTH2_CLIENT_ID, then the authorization
    // succeeds with no user intervention. Otherwise, it fails and the
    // user interface that prompts for authorization needs to display.
    function checkAuth(defered, force) {
      var immediate = !!$cookies.get("logged");

      if (immediate || force) {
          gapi.auth.authorize({
              client_id: OAUTH2_CLIENT_ID,
              scope: OAUTH2_SCOPES,
              immediate: immediate,
              cookie_policy: 'single_host_origin'
          }, function (authResult) {
              handleAuthResult(authResult, defered);
          });        
      } else {
          defered.reject();
      }
    }
    // Handle the result of a gapi.auth.authorize() call.
    function handleAuthResult(authResult, defered) {

      if (authResult && !authResult.error) {
          $cookies.put("logged", true);
          // Authorization was successful. Hide authorization prompts and show
          // content that should be visible after authorization succeeds.
          // loadAPIClientInterfaces();
          handleAPILoaded();
          defered.resolve();
      } else {
          $cookies.remove("logged");
          defered.reject();
      }     
    }
    // Load the client interfaces for the YouTube Analytics and Data APIs, which
    // are required to use the Google APIs JS client. More info is available at
    // http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
    
    // function loadAPIClientInterfaces() {
    //   gapi.client.load('youtube', 'v3', function() {
    //     handleAPILoaded();
    //   })
    // }

    function userInfo(){
        return vm.userName;
    }

    function handleAPILoaded () {
        if(!vm.userName){
            var request = gapi.client.youtube.channels.list({
                mine: true,
                part: 'snippet'
            });
            request.execute(function (data) {  
                vm.userName = data.items[0].snippet.title;
            });
        }else{
          return;
        }
    }

  }

})();