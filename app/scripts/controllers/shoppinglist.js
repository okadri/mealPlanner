'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:ShoppinglistCtrl
 * @description
 * # ShoppinglistCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('ShoppinglistCtrl',
  ['$scope', 'allItems', 'allMeals', 'mealService', 'shoppingListService',
  this.ShoppinglistCtrl = function ($scope, allItems, allMeals, mealService, shoppingListService) {
    $scope.allItems = allItems;

    $scope.searchIngredients = function(q) {
      return mealService.searchIngredients(q);
    };

    $scope.addItem = function(item) {
      item = item.charAt(0).toUpperCase() + item.slice(1);
      shoppingListService.addItem(item);
      $scope.newItem = '';
    };

    $scope.deleteItem = function(item) {
      shoppingListService.deleteItem(item);
    };
  }
]);

ShoppinglistCtrl.getAllItems = ["shoppingListService", function(shoppingListService) {
  return shoppingListService.getAll();
}];

ShoppinglistCtrl.getAllMeals = ["mealService", function(mealService) {
	return mealService.getAll();
}];
