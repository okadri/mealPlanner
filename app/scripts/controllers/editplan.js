'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditplanCtrl
 * @description
 * # EditplanCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditplanCtrl', this.EditplanCtrl = function ($scope, $modalInstance, mealService, mealId, allMeals) {
    $scope.allMeals = allMeals;

    mealService.getOneById(mealId).then(function(res){
      $scope.meal = res;
    })

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
