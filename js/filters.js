'use strict';

/* Filters */

angular.module('QuizPOC.filters', []).
  filter('formatTimer', [function() {
    return function(input)
    {
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        var hours = Math.floor(minutes / 60);
        return (z(minutes)+':'+z(seconds));
    };    
  }])
  .filter('startFrom', [function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
}]);