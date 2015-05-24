'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditplanCtrl
 * @description
 * # EditplanCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditplanCtrl', this.EditplanCtrl = function ($scope, $modalInstance, allMeals) {
    $scope.allMeals = allMeals;

    $scope.setMeal = function(meal) {
      $scope.meal = meal;
      $modalInstance.close($scope.meal);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });

EditplanCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};
