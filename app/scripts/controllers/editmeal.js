'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditmealCtrl
 * @description
 * # EditmealCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditmealCtrl', this.EditmealCtrl = function ($scope, $modalInstance, meal, meatTypeService, frequencyService) {
    $scope.meal = meal || {};
    $scope.meatTypes = meatTypeService.getAll();
    $scope.frequencies = frequencyService.getAll();
    $scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    $scope.saveMeal = function() {
      $modalInstance.close($scope.meal);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
