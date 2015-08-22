'use strict';

var FIREBASE_URL = 'https://meal-planner.firebaseIO.com';

/**
 * @ngdoc overview
 * @name mealPlannerApp
 * @description
 * # mealPlannerApp
 *
 * Main module of the application.
 */
window.mealPlannerApp = angular
  .module('mealPlannerApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.calendar',
    'firebase',
    'ui.bootstrap',
    'ngTagsInput'
  ]);

//Generates the $firebaseAuth instance
mealPlannerApp.factory('Auth', function ($firebaseAuth) {
  var ref = new Firebase(FIREBASE_URL);
  return $firebaseAuth(ref);
});

//redirects to homepage if $requireAuth rejects
mealPlannerApp.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    console.log("routeChangeError", error);
    if (error === "AUTH_REQUIRED") {
      console.log("Auth required, redirecting to login page");
      $location.path("/login");
    }
  });
}]);

mealPlannerApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
    		resolve: {
    			allPlans: MainCtrl.getAllPlans,
          allMeals: MainCtrl.getAllMeals,
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/meals', {
        templateUrl: 'views/meals.html',
        controller: 'MealsCtrl',
        resolve: {
    			allMeals: MealsCtrl.getAllMeals,
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/meals/:id', {
        templateUrl: 'views/editmeal.html',
        controller: 'EditmealCtrl',
        resolve: {
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/shoppingList', {
        templateUrl: 'views/shoppinglist.html',
        controller: 'ShoppinglistCtrl',
        resolve: {
          allMeals: ShoppinglistCtrl.getAllMeals,
    			allItems: ShoppinglistCtrl.getAllItems,
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          currentAuth: function(Auth) {
            return Auth.$waitForAuth();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
