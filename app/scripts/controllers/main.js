'use strict';

/**
 * @ngdoc function
 * @name dinnerPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dinnerPlannerApp
 */
var MainCtrl = angular.module('dinnerPlannerApp')
  .controller('MainCtrl', function ($scope, planService, allPlans) {
    $scope.plans = allPlans;

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month agendaWeek',
          center: 'title',
          right: 'today prev,next'
        },
        events: allPlans,
        dayClick: function(){ console.log('day clicked'); },
        eventDrop: function(){ console.log('event dropped'); },
        eventResize: function(){ console.log('event resized'); }
      }
    };
  });

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
