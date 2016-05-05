/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('newYt')
    .constant('malarkey', malarkey)
    .constant('YTBASE', 'https://newyoutube.firebaseio.com/')
    .constant('moment', moment);

})();
