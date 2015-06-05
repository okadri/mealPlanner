'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('LoginCtrl', function ($scope, $firebaseAuth, $location) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    if (auth.$getAuth()) $location.path("/");

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
