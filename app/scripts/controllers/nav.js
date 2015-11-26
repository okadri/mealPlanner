'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('NavCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.logout = function() {
      Auth.$unauth();
      $location.path('/login');
    };

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
  }]);
