'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('LoginCtrl',
  ['$scope', '$location', 'currentAuth',
  function ($scope, $location, currentAuth) {
    var ref = new Firebase(FIREBASE_URL);
    $scope.signInBtn = "Sign in";

    if (currentAuth) {
      console.log("already logged in, redirecting to main");
      $location.path("/");
    }

    $scope.login = function() {
      $scope.signInBtn = "Signing in...";
      ref.authWithPassword({
        email    : $scope.email,
        password : $scope.password
      }, function(error, authData) {
        if (error) {
          $scope.signInBtn = "Sign in";
          $scope.message = "Login failed, please try again.";
          console.log("Login Failed!", error);
        } else {
          $location.path("/").replace();
          console.log("Login successful");
        }
        $scope.$apply();
      });
    };
  }
]);
