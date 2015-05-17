'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MainCtrl', this.MainCtrl = function ($scope, $modal, planService, allPlans) {
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

    $scope.startModal = function() {
  		var modalInstance = $modal.open({
  			templateUrl: '/views/editplan.html',
        controller: EditplanCtrl,
  			resolve: {
  				meal: function () {
  					return $scope.meal;
  				}
  			}
  		});

  		modalInstance.result.then(function (meal) {
        console.log('modal result', meal);
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
          $scope.startModal();
        }
      }
    };
  });

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
