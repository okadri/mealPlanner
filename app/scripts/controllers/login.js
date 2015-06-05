'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('LoginCtrl', function ($scope, $location, currentAuth) {
    var ref = new Firebase(FIREBASE_URL);

    if (currentAuth) {
      console.log("already logged in, redirecting to main");
      $location.path("/");
    }

    $scope.login = function() {
      ref.authWithPassword({
        email    : $scope.email,
        password : $scope.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          $location.path("/");
        }
      });
    };
  });
