'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditmealCtrl
 * @description
 * # EditmealCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditmealCtrl', this.EditmealCtrl = function ($scope, meal) {
    $scope.meal = meal;

    $scope.saveMeal = function(meal) {
      $modalInstance.close(meal);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
