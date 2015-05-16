'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealPlannerApp
 */
var MainCtrl = angular.module('mealPlannerApp')
  .controller('MainCtrl', function ($scope, planService, allPlans) {
    $scope.planSources = [{
          color: '#dff0d8',
          textColor: '#333',
          events: allPlans
        },{
          color: '#d9edf7',
          textColor: '#333',
          events: planService.getSuggestions()
        }
      ];

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month agendaWeek',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function(date, jsEvent, view){
          planService.addPlan({title: date.format(), start: date.format()});
        }
      }
    };
  });

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
