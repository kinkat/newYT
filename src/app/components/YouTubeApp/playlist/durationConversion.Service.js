// (function() {
//     'use strict';

//     angular
//         .module('newYt')
//         .service('durationService', durationService);

//     function durationService() {
//         var vm = this;

//         vm.convertDurationToSeconds = convertDurationToSeconds;

//         function convertDurationToSeconds(input) {

//             var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
//             var hours = 0, minutes = 0, seconds = 0, totalseconds;

//             if (reptms.test(input)) {
//                 var matches = reptms.exec(input);
//                 if (matches[1]) hours = Number(matches[1]);
//                 if (matches[2]) minutes = Number(matches[2]);
//                 if (matches[3]) seconds = Number(matches[3]);
//                 var totalseconds = hours * 3600  + minutes * 60 + seconds;
//                 console.log(totalseconds);
//             }

//         return (totalseconds);

//         }

//     }

// })();
