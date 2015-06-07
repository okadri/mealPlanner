'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MainCtrl',
  ['$scope', 'Auth', '$location', '$modal', 'planService', 'mealService', 'allPlans', 'allMeals',
  this.MainCtrl = function ($scope, Auth, $location, $modal, planService, mealService, allPlans, allMeals) {

    $scope.getSuggestions = function() {
      $scope.suggestions = planService.getSuggestions(allMeals);
    }
    $scope.getSuggestions();

    $scope.planSources = [
      {
        color: '#dff0d8',
        textColor: '#333',
        events: allPlans
      },{
        color: '#d9edf7',
        textColor: '#333',
        events: $scope.suggestions
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
        var toBeSaved = planService.newPlan(meal, date, plan);

        planService.savePlan(toBeSaved);
  		});
  	};

    $scope.addIngredientsByDateRange = function (start, end) {
      var modalInstance = $modal.open({
  			templateUrl: '/views/addIngredients.html',
        controller: AddingredientsCtrl,
  			resolve: {
          ingredients: function() {
            return mealService.findIngredientsByDateRange(start,end);
          },
          shoppingItems: AddingredientsCtrl.getAllItems
  			}
  		});

  		modalInstance.result.then(function () {
        $location.path('/shoppingList');
  		});
    };

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
        selectable: true,
        timezone: 'local',
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
          var plan = planService.findOneByDate(startDate);
          if (plan) {
            $scope.addIngredientsByDateRange(startDate, endDate);
          }
        },
        eventClick: function( event, jsEvent, view ) {
          var plan = planService.findOneByDate(event.start);
          if (plan) {
            // It's a plan, bring up the modal to edit
            $scope.startModal(event.start, event);
          } else {
            // It's a suggestion, confirm It
            var toBeSaved = planService.newPlan(event.meal, event.start, event);
            planService.savePlan(toBeSaved);
          }
        }
      }
    };
  }]);

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
MainCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};
