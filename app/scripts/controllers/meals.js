'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MealsCtrl',
  ['$scope', '$modal', 'mealService', 'allMeals',
  this.MealsCtrl = function ($scope, $modal, mealService, allMeals) {
    $scope.allMeals = allMeals;

    $scope.editMeal = function(meal) {
      var modalInstance = $modal.open({
        templateUrl: '/views/editmeal.html',
        controller: EditmealCtrl,
        resolve: {
          meal: function () {
            return meal;
          },
          allIngredients: function() {
            return mealService.getAllIngredients();
          }
        }
      });

      modalInstance.result.then(function (meal) {
        mealService.saveMeal(meal);
      });
    };

    $scope.deleteMeal = function(meal) {
      mealService.deleteMeal(meal);
    };
  }
]);

MealsCtrl.getAllMeals = ["mealService", function(mealService) {
	return mealService.getAll();
}];
