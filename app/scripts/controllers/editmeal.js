'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditmealCtrl
 * @description
 * # EditmealCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditmealCtrl',
  ['$scope', '$modalInstance', 'mealService', 'meal', 'meatTypeService', 'frequencyService',
  this.EditmealCtrl = function ($scope, $modalInstance, mealService, meal, meatTypeService, frequencyService) {
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

    $scope.queryIngredients = function(q) {
      return mealService.searchIngredients(q);
    }
  }
]);
