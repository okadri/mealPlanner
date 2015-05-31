'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.mealService
 * @description
 * # mealService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('Meal', function() {
  	function Meal(mealData) {
  		if (mealData) {
  			this.setData(mealData);
  		}
  	}
  	Meal.prototype = {
  			setData: function(mealData) {
  				angular.extend(this, mealData);
  			}
  	};
  	return Meal;
  })
  .factory('mealService', function ($q, $filter, $firebaseArray, $firebaseObject, Meal, planService) {
    return {
      _pool: [],
      _allIngredients: [],
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

        var ref = new Firebase(FIREBASE_URL + '/meals');
        this._pool = $firebaseArray(ref);

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      getOneById: function (id) {
        var meal;

        if (this._pool.length > 0) {
          meal = this._findById(this._pool, id)
        } else {
          var mealRef = new Firebase(FIREBASE_URL + '/meals/' + id);
          meal = $firebaseObject(mealRef);
        }

        return meal;
      },
      saveMeal: function (meal) {
        var deferred = $q.defer();
        var savedMeal;

        if (!meal.seasonal) {
          delete meal.startDate;
          delete meal.endDate;
        }

        if (meal.$id) {
          savedMeal = this._pool.$save(meal);
        } else {
          savedMeal = this._pool.$add(meal);
        }

        deferred.resolve(savedMeal);
        return deferred.promise;
      },
      deleteMeal: function (meal) {
        this._pool.$remove(meal);
      },
      getAllIngredients: function() {
        var scope = this;

        for(var i in scope._pool) {
          angular.forEach(scope._pool[i].ingredients, function(ingredient) {
            if (scope._allIngredients.indexOf(ingredient.text) < 0) {
              scope._allIngredients.push(ingredient.text);
            }
          });
        }

        return scope._allIngredients;
      },
      searchIngredients: function(q) {
        var deferred = $q.defer();

        // Update allIngredients
        this.getAllIngredients();

        var matchingIngredients = $filter('filter')(this._allIngredients, q);

        deferred.resolve(matchingIngredients);
        return deferred.promise;
      },
      findIngredientsByDateRange: function(start, end) {
        var deferred = $q.defer();
        var ingredients = [];

        for(var i=start; start.isBefore(end); start.add(1,'day')) {
          var plan = planService.findOneByDate(i);
          angular.forEach(plan.meal.ingredients, function(ingredient) {
            ingredients.push(ingredient);
          });
        }

        deferred.resolve(ingredients);
        return deferred.promise;
      }
    };
  });
