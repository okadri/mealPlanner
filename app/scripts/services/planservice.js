'use strict';

/**
 * @ngdoc service
 * @name dinnerPlannerApp.planService
 * @description
 * # planService
 * Factory in the dinnerPlannerApp.
 */
angular.module('dinnerPlannerApp')
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
  .factory('planService', function ($q, Plan) {
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

        this._pool = [
            {
                title  : 'event1',
                start  : '2015-05-01'
            },
            {
                title  : 'event2',
                start  : '2015-05-05',
                end    : '2015-05-07'
            },
            {
                title  : 'event3',
                start  : '2015-05-09T12:30:00',
                allDay : false // will make the time show
            }
        ];

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      save: function (plan) {
        var deferred = $q.defer();


        deferred.resolve(this._pool);
        return deferred.promise;
      }
    };
  });
