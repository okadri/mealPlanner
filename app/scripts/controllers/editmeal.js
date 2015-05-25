'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditmealCtrl
 * @description
 * # EditmealCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditmealCtrl', this.EditmealCtrl = function ($scope, $modalInstance, meal) {
    $scope.meal = meal || {};

    $scope.saveMeal = function() {
      $modalInstance.close($scope.meal);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
