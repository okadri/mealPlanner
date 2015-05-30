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
  				},
  				plan: function () {
            if (!plan) return null;
  					return plan;
  				}
  			}
  		});

  		modalInstance.result.then(function (meal) {
        var toBeSaved = plan ? planService.getOneById(plan.$id) : {};

        toBeSaved.title= meal.name;
        toBeSaved.mealId = meal.$id;
        toBeSaved.meal = meal;
        toBeSaved.start = date.format();

        planService.savePlan(toBeSaved);
  		});
  	};

    $scope.addIngredientsByDateRange = function (start, end) {
      var modalInstance = $modal.open({
  			templateUrl: '/views/addIngredients.html',
        controller: AddingredientsCtrl,
  			resolve: {
          meals: function() {
            return mealService.addIngredientsByDateRange(start,end);
          }
  			}
  		});

  		modalInstance.result.then(function (meal) {
  		});
    };

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        selectable: true,
        header:{
          left: 'month agendaWeek',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function(date, jsEvent, view){
          var plan = planService.findOneByDate(date);
          if (!plan) {
            $scope.startModal(date);
          }
        },
        select: function(startDate, endDate, allDay, jsEvent, view) {
          $scope.addIngredientsByDateRange(startDate, endDate);
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
