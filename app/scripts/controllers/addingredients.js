'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:AddingredientsCtrl
 * @description
 * # AddingredientsCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('AddingredientsCtrl', this.AddingredientsCtrl = function ($scope, meals) {
    $scope.meals = meals;
  });
