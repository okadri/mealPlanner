'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.planService
 * @description
 * # planService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('Plan', function() {
  	function Plan(planData) {
  		if (planData) {
  			this.setData(planData);
  		}
  	}
  	Plan.prototype = {
  			setData: function(planData) {
  				angular.extend(this, planData);
  			}
  	};
  	return Plan;
  })
  .factory('planService',
  ['$q', '$firebaseArray', 'Plan',
  function ($q, $firebaseArray, Plan) {
    return {
      _pool: null,
      _suggestions: [],
      _findById: function(arr, id) {
      	for(var el in arr) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(arr.hasOwnProperty(el)) {
      			if(arr[el].$id === id) {
              return arr[el];
            }
      		}
      	}

      	return undefined;
      },

      // Public methods
      getAll: function () {
        var deferred = $q.defer();
        var scope = this;

        var ref = new Firebase(FIREBASE_URL + '/plans');
        var query = ref.orderByChild("start").limitToLast(80);
        this._pool = $firebaseArray(query);
        this._pool.$loaded(function(plans){
          deferred.resolve(scope._pool);
        });

        return deferred.promise;
      },
      getOneById: function (id) {
        return this._findById(this._pool, id);
      },
      findOneByDate: function (date) {
        for(var el in this._pool) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(this._pool.hasOwnProperty(el)) {
      			if(this._pool[el].start === date.format('YYYY-MM-DD')) {
              return this._pool[el];
            }
      		}
      	}

      	return undefined;
      },
      savePlan: function (plan) {
        var deferred = $q.defer();
        var savedPlan;

        if (plan.$id) {
          savedPlan = this._pool.$save(plan);
        } else {
          savedPlan = this._pool.$add(plan);
        }

        this.deleteSuggestionByDate(moment(plan.start));

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      deletePlan: function (plan) {
        var instance = this.getOneById(plan.$id);
        this._pool.$remove(instance);
      },
      newPlan: function(meal,date, plan) {
        var toBeSaved = (plan && plan.$id) ? this.getOneById(plan.$id) : {};

        toBeSaved.title= meal.name;
        toBeSaved.mealId = meal.$id;
        toBeSaved.meal = meal;
        toBeSaved.start = date.format('YYYY-MM-DD');
        toBeSaved.stick = true

        return toBeSaved;
      },
      deleteSuggestionByDate: function (date) {
        for(var el in this._suggestions) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(this._suggestions.hasOwnProperty(el)) {
      			if(this._suggestions[el].start === date.format('YYYY-MM-DD')) {
              this._suggestions.splice(el,1);
            }
      		}
      	}

      	return undefined;
      },
      getSuggestions: function(allMeals) {
        var num = 10
        var rand, conflictingPlans;
        var today = moment();
        var dateWindow = moment();
        var scope = this;

        scope._suggestions.length = 0;
        while(allMeals.length > num && scope._suggestions.length < num) {
          rand = Math.floor(Math.random() * allMeals.length);
          dateWindow = moment();
          var foundConflict = false;

          // Check if the current confirmed plans have conflicts
          var p;
          for (var i = 0; i < this._pool.length; i++) {
            p = this._pool[i]
            dateWindow = moment();
            dateWindow.add(
              scope._suggestions.length - (allMeals[rand].frequency * 7)
              , 'day'
              ).format('YYYY-MM-DD');
            if (p.start > dateWindow.format('YYYY-MM-DD')
            && allMeals[rand].$id === p.mealId) {
              foundConflict = true;
              console.log('%c' + p.meal.name + ' has a conflict in confirmed plans', 'color: #00688B');
              break;
            }
          }

          // Check if the current suggestions have conflicts
          for (var i = 0; i < this._suggestions.length; i++) {
            p = this._suggestions[i]
            if (allMeals[rand].$id === p.mealId) {
              foundConflict = true;
              console.log('%c' + p.meal.name + ' has a conflict in suggestions', 'color: #E59400');
              break;
            }
          }

          // Check if with the meal season
          var isWithinSeason = !allMeals[rand].seasonal || (
                allMeals[rand].seasonal
            &&  allMeals[rand].startDate <= today.month()
            &&  allMeals[rand].endDate >= today.month()
          );
          if (!isWithinSeason) console.log('%c' + allMeals[rand].name + ' is not within season', 'color: #FFA500');

          // Check if it has a different meat type
          var isDifferentMeat = (
            ( // First suggestion? Make sure meat is different from last plan
              scope._suggestions.length === 0
              && this._pool[this._pool.length-1].meal.meatId !== allMeals[rand].meatId)
              ||
            ( // Other suggestions? Make sure meat is different from previous suggestion
              scope._suggestions.length > 0
              && scope._suggestions[scope._suggestions.length-1].meal.meatId !== allMeals[rand].meatId)
          );
          if (!isDifferentMeat) console.log('%c' + allMeals[rand].name + ' has the same meat type', 'color: #663300');

          // If all is good, push to suggestions
          if ( !foundConflict && isWithinSeason && isDifferentMeat) {
            if (!scope.findOneByDate(today)) {
              console.log('%c' + allMeals[rand].name + ' is added to suggestions!', 'color: #BADA55');
              scope._suggestions.push(
                scope.newPlan(
                  allMeals[rand],
                  today
                )
              );
            }
            today.add(1,'day');
          }
        }

        return scope._suggestions;
      }
    };
  }]);
