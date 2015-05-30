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
  .factory('mealService', function ($q, $firebaseArray, $firebaseObject, Meal) {
    return {
      _pool: null,
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
        var deferred = $q.defer();

        var mealRef = new Firebase(FIREBASE_URL + '/meals/' + id);
        var meal = $firebaseObject(mealRef);

        deferred.resolve(meal);
        return deferred.promise;
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
      }
    };
  });
