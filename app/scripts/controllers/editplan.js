'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditplanCtrl
 * @description
 * # EditplanCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditplanCtrl', this.EditplanCtrl = function ($scope, $modalInstance, mealService, planService, mealId, plan, allMeals) {
    $scope.allMeals = allMeals;
    $scope.mealId = mealId;

    mealService.getOneById(mealId).then(function(res){
      $scope.meal = res;
    })

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

  });

EditplanCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};
