'use strict';

/**
 * @ngdoc overview
 * @name dinnerPlannerApp
 * @description
 * # dinnerPlannerApp
 *
 * Main module of the application.
 */
angular
  .module('dinnerPlannerApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
