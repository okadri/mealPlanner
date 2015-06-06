'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
  }]);
