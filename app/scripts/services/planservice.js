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

        var ref = new Firebase(FIREBASE_URL + '/plans');
        var query = ref.orderByChild("start").limitToLast(80);
        this._pool = $firebaseArray(query);

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      getOneById: function (id) {
        return this._findById(this._pool, id);
      },
      findOneByDate: function (date) {
        for(var el in this._pool) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(this._pool.hasOwnProperty(el)) {
      			if(this._pool[el].start === date.format()) {
              return this._pool[el];
            }
      		}
      	}

      	return undefined;
      },
      savePlan: function (plan) {
        var deferred = $q.defer();
        var savedPlan;

        plan.stick = true

        if (plan.$id) {
          savedPlan = this._pool.$save(plan);
        } else {
          savedPlan = this._pool.$add(plan);
        }

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      deletePlan: function (plan) {
        var instance = this.getOneById(plan.$id);
        this._pool.$remove(instance);
      },
      getSuggestions: function() {
        // TODO
        return [];
      }
    };
  }]);
