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
      calendar: {
        theme: true,
        contentHeight: 450,
        defaultView: 'month',
        selectable: true,
        allDayDefault: false,
        allDaySlot: false,
        slotEventOverlap: false,
        minTime: 7,
        maxTime: 18,
        header: {
          left: 'prev,next',
          center: 'title',
          right: 'today month,basicWeek',
          ignoreTimezone: false
        },
      }
    };
  });

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
