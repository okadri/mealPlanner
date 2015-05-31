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
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
    		resolve: {
    			allPlans: MainCtrl.getAllPlans
    		}
      })
      .when('/meals', {
        templateUrl: 'views/meals.html',
        controller: 'MealsCtrl',
        resolve: {
    			allMeals: MealsCtrl.getAllMeals
    		}
      })
      .when('/meals/:id', {
        templateUrl: 'views/editmeal.html',
        controller: 'EditmealCtrl'
      })
      .when('/shoppingList', {
        templateUrl: 'views/shoppinglist.html',
        controller: 'ShoppinglistCtrl',
        resolve: {
          allMeals: ShoppinglistCtrl.getAllMeals,
    			allItems: ShoppinglistCtrl.getAllItems
    		}
      })
      .otherwise({
        redirectTo: '/'
      });
  });
