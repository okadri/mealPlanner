'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditplanCtrl
 * @description
 * # EditplanCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditplanCtrl',
  ['$scope', '$modalInstance', 'mealService', 'planService', 'mealId', 'plan', 'allMeals',
  this.EditplanCtrl = function ($scope, $modalInstance, mealService, planService, mealId, plan, allMeals, meatTypeService) {
    $scope.allMeals = allMeals;
    $scope.mealId = mealId;
    $scope.meatTypes = meatTypeService.getAll();

    $scope.meal = mealService.getOneById(mealId)

    $scope.filterMeatType = function(meatId) {
      meatId = meatId.toString();
      if ($scope.selectedMeatType.meatId === meatId) {
        $scope.selectedMeatType = {};
      } else {
        $scope.selectedMeatType.meatId = meatId;
      }
    };

    $scope.setMeal = function() {
      $modalInstance.close($scope.meal);
    };

    $scope.deletePlan = function() {
      $scope.meal = $scope.mealId = null;
      planService.deletePlan(plan);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);

EditplanCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};
