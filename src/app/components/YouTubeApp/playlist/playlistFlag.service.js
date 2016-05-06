//sets logout button flag
(function() {
  'use strict';

  angular
      .module('newYt')
      .service('flagService', flagService);

     function flagService() {

        var flagVm = this;

        flagVm.updateFlag = updateFlag;

        flagVm.playFlag = {val:true};

        function updateFlag() {
            flagVm.playFlag.val = !flagVm.playFlag.val;
        }

     }

})();
