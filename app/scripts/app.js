'use strict';

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
    'ui.bootstrap'
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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
