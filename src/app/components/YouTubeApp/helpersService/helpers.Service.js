(function() {
    'use strict';

    angular
        .module('newYt')
        .service('helpersService', helpersService);

    function helpersService() {
        var vm = this;

        vm.formatTime = formatTime;
        vm.formatMinute = formatMinute;
        vm.convertDurationToSeconds = convertDurationToSeconds;

        function formatTime(time) {
            time = Math.round(time);
            return time;
        }

        function formatMinute(time) {
            time = Math.round(time);
            var minutes = Math.floor(time / 60),
            seconds = time - minutes * 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            return minutes + ":" + seconds;
        }


        function convertDurationToSeconds(input) {

            var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
            var hours = 0, minutes = 0, seconds = 0, totalseconds;

            if (reptms.test(input)) {
                var matches = reptms.exec(input);
                if (matches[1]) hours = Number(matches[1]);
                if (matches[2]) minutes = Number(matches[2]);
                if (matches[3]) seconds = Number(matches[3]);
                totalseconds = hours * 3600  + minutes * 60 + seconds;
            }

        return totalseconds;

        }

    }

})();
