'use strict';

/**
 * @ngdoc directive
 * @name mealPlannerApp.directive:onEnter
 * @description
 * # onEnter
 */
angular.module('mealPlannerApp')
  .directive('onEnter', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
          if (event.which === 13) { // Enter
            scope.$apply(function() {
              scope.$eval(attrs.onEnter);
              event.preventDefault();
            });
          }
        });
      }
    };
  });
