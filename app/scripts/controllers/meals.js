'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MealsCtrl', this.MealsCtrl = function ($scope, $modal, mealService, allMeals) {
    $scope.allMeals = allMeals;

    $scope.editMeal = function(meal) {
      var modalInstance = $modal.open({
        templateUrl: '/views/editmeal.html',
        controller: EditmealCtrl,
        resolve: {
          meal: function () {
            return meal;
          }
        }
      });

      modalInstance.result.then(function (meal) {
        mealService.saveMeal(meal);
      });
    };
  });

MealsCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};
