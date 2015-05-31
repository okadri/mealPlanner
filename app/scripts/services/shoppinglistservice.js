'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.shoppingListService
 * @description
 * # shoppingListService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('shoppingListService', this.shoppingListService = function ($q, $firebaseArray) {
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

        var ref = new Firebase(FIREBASE_URL + '/shoppingItems');
        this._pool = $firebaseArray(ref);

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      addItem: function (item) {
        var deferred = $q.defer();

        if (this._pool.indexOf(item) < 0) {
          this._pool.$add(item);
        }

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      getOneById: function (id) {
        return this._findById(this._pool, id);
      },
      deleteItem: function (item) {
        var instance = this.getOneById(item.$id);
        this._pool.$remove(instance);
      }
    };
  });
