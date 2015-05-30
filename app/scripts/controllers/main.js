'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MainCtrl', this.MainCtrl = function ($scope, $modal, planService, mealService, allPlans) {
    $scope.planSources = [
      {
        color: '#dff0d8',
        textColor: '#333',
        events: allPlans
      },{
        color: '#d9edf7',
        textColor: '#333',
        events: planService.getSuggestions()
      }
    ];

    $scope.startModal = function(date, plan) {
  		var modalInstance = $modal.open({
  			templateUrl: '/views/editplan.html',
        controller: EditplanCtrl,
  			resolve: {
          allMeals: EditplanCtrl.getAllMeals,
  				mealId: function () {
            if (!plan) return null;
  					return plan.mealId;
  				}
  			}
  		});

  		modalInstance.result.then(function (meal) {
        var toBeSaved = plan || {};

        toBeSaved.title= meal.name;
        toBeSaved.mealId = meal.$id;
        toBeSaved.meal = meal;
        toBeSaved.start = date.format();

        planService.savePlan(toBeSaved);
  		});
  	};

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
          $scope.startModal(date);
        },
        eventClick: function( event, jsEvent, view ) {
          $scope.startModal(event.start, event);
        }
      }
    };
  });

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
