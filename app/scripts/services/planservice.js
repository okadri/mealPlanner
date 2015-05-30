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
  .factory('planService', function ($q, $firebaseArray, Plan) {
    return {
      _pool: null,
      _findById: function(arr, id) {
      	for(var el in arr) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(arr.hasOwnProperty(el)) {
      			if(arr[el].id === id) {
              return arr[el];
            }
      		}
      	}

      	return undefined;
      },
  		_retrieveInstance: function(plan) {
  			var instance = this._findById(this._pool, plan.id);

  			if (instance) {
  				instance.setData(plan);
  			} else {
  				instance = new Plan(plan);
  				this._pool.push(instance);
  			}

  			return instance;
  		},

      // Public methods
      getAll: function () {
        var deferred = $q.defer();

        var ref = new Firebase(FIREBASE_URL + '/plans');
        this._pool = $firebaseArray(ref);

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      addPlan: function (plan) {
        var deferred = $q.defer();

        this._pool.$add(plan);

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      getSuggestions: function() {
        return [];
      }
    };
  });
