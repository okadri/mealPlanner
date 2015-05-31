'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:AddingredientsCtrl
 * @description
 * # AddingredientsCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('AddingredientsCtrl', this.AddingredientsCtrl = function ($scope, $modalInstance, shoppingListService, ingredients, shoppingItems) {
    $scope.ingredients = ingredients;

    $scope.addItems = function() {
      shoppingListService.addItems($scope.ingredients).then(function(){
        $modalInstance.close();
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.deleteIngredient = function(ingredient) {
      var index = $scope.ingredients.indexOf(ingredient);
      $scope.ingredients.splice(index, 1);
    };
  });
AddingredientsCtrl.getAllItems = function(shoppingListService) {
  return shoppingListService.getAll();
};
